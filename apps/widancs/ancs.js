

(() => {

  var s = require("Storage").readJSON("widancs.json",1)||{settings:{enabled:false, category:[1,2,4]}};
  var ENABLED = s.settings.enabled;
  var CATEGORY = s.settings.category;

  var notifyqueue = [];
  var current = {cat:0,uid:0};
    
  var screentimeout;
  var inalert = false;
  
  function release_screen(){
    screentimeout= setTimeout(() => { 
        SCREENACCESS.release(); 
        screentimeout = undefined; 
        inalert=false; 
        next_notify();
    }, 500);
  } 

  var unicodeRemap = {
    '2019':"'"
  };
  var replacer = ""; //(n)=>print('Unknown unicode '+n.toString(16));

  function displaymsg(m){
    //we may already be displaying a prompt, so clear it
    E.showPrompt();
    if (screentimeout) clearTimeout(screentimeout);
    Bangle.setLCDPower(1);
    SCREENACCESS.request();
    Bangle.buzz();
    var ttl = E.decodeUTF8(m.title, unicodeRemap, replacer);
    var msg = E.decodeUTF8(m.message, unicodeRemap, replacer);
    if (current.cat!=1){
      E.showAlert(msg,ttl).then(()=>{
        NRF.ancsAction(current.uid,0);
        release_screen();
      });
    } else {
      E.showPrompt(msg,{title:ttl,buttons:{"Accept":true,"Cancel":false}}).then((r)=>{
        NRF.ancsAction(current.uid,r);
        release_screen();
      });
    }
  }

  var notifyTO;
  function getnotify(d){
    if (d.event!="add") return;
    if (notifyTO) clearTimeout(notifyTO);
    if(!CATEGORY.includes(d.category)) return; 
    var len = notifyqueue.length;
    if (d.category == 1) { // it's a call so pre-empt
        if (inalert) {notifyqueue.push(current); inalert=false;}
        notifyqueue.push({cat:d.category, uid:d.uid});
    } else if (len<32)
        notifyqueue[len] = {cat:d.category, uid:d.uid};
    notifyTO = setTimeout(next_notify,1000);
  }

  function next_notify(){
    if(notifyqueue.length==0 || inalert) return;
    inalert=true;
    current = notifyqueue.pop();
    NRF.ancsGetNotificationInfo(current.uid).then(
      (m)=>{displaymsg(m);}
    ).catch(function(e){
      inalert = false;
      next_notify();
      E.showMessage("ANCS: "+e,"ERROR");
    });
}

  var stage = 0    
  //grey, pink, lightblue, yellow, green
  function draw(){
    var colors = new Uint16Array([0xc618,0xf818,0x3ff,0xffe0,0x07e0,0x0000]);
    var img = E.toArrayBuffer(atob("GBgBAAAABAAADgAAHwAAPwAAf4AAP4AAP4AAP4AAHwAAH4AAD8AAB+AAA/AAAfgAAf3gAH/4AD/8AB/+AA/8AAf4AAHwAAAgAAAA"));
    g.setColor(colors[stage]);
    g.drawImage(img,this.x,this.y);
  }
    
  WIDGETS["ancs"] ={area:"tl", width:26,draw:draw};

  E.showAlert = function(msg,title) {
    return E.showPrompt(msg,{title:title,buttons:{Ok:1}});
  }
  
  function changed(){
    stage = NRF.getSecurityStatus().connected ? 4 : 3;
    WIDGETS["ancs"].draw();
  }
  
  if (ENABLED && typeof SCREENACCESS!='undefined') {
    E.on("ANCS", getnotify);
    NRF.on('connect',changed);
    NRF.on('disconnect',changed);
    NRF.setServices({},{ancs:true});
    stage = NRF.getSecurityStatus().connected ? 4 : 3;
  }
  
  })();

  /* Test script

E.setConsole("USB", {force:true});
E.on("ANCS", (nn)=>{console.log("ancs" ,nn);});
E.on("ANCSMSG", (nn)=>{console.log("msg" ,nn);});
NRF.setServices({},{ancs:true});
var rr = NRF.requestANCSMessage;
var dd = NRF.sendANCSAction;

ancs {
  "event": "add",
  "uid": 0, "category": 4, "categoryCnt": 1, "silent": true, "important": false,
  "pre_existing": true, "positive": false, "negative": true 
}

msg { "uid": 1,
  "appid": "com.apple.MobileSMS",
  "title": "+44 7800 008142",
  "subtitle": "",
  "message": "Appt reminder: 18 Oct at 11:50AM with Ms Saira Zafar at The Vineyard Surgery. To cancel the appointment, text back CANCEL. IF YOU ARE COMING INTO THE SURGERY, WE ADVISE YOU WEAR A FACE COVERING AND SANITISE YOUR HANDS UPON ENTRY. https://www.thevineyardsur",
  "message_size": "256",
  "date": "20211017T130313",
  "posaction": "",
  "negaction": "Clear",
  "name": ""
 }

*/

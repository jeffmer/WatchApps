/*  Touch based - Desktop launcher
*/

var s = require("Storage");  
var w = g.getWidth();
var h = g.getHeight();

var apps = s.list(/\.info$/).map(app=>{var a=s.readJSON(app,1);return a&&{name:a.name,type:a.type,icon:a.icon,sortorder:a.sortorder,src:a.src};}).filter(app=>app && (app.type=="app" || app.type=="clock" || !app.type));
apps.sort((a,b)=>{
  var n=(0|a.sortorder)-(0|b.sortorder);
  if (n) return n; // do sortorder first
  if (a.name<b.name) return -1;
  if (a.name>b.name) return 1;
  return 0;
});
apps.forEach(app=>{
    if (app.icon)
      app.icon = s.read(app.icon); // should just be a link to a memory area
  });

var Napps = apps.length;
var Npages = Math.ceil(Napps/6);
var maxPage = Npages-1;
var selected = -1;
var page = 0;
const XOFF = 0;
const YOFF = 80;
const CELL = 140;

function draw_icon(p,n,selected) {
    var x = (n%3)*CELL+XOFF; 
    var y = n>2?CELL+YOFF:YOFF;
    (selected?g.setColor(0.7,0.7,0.7):g.setColor(g.theme.bg)).fillRect(x+16,y,x+144,y+CELL-1);
    g.setColor(g.theme.fg);
    try{g.drawImage(apps[p*6+n].icon,x+30,y+8,{scale:2.0});} catch(e){}
    g.setFontAlign(0,-1,0).setFont("6x8",2);
    var txt =  apps[p*6+n].name.split(" ");
    for (var i = 0; i < txt.length; i++) {
        txt[i] = txt[i].trim();
        g.drawString(txt[i],x+CELL/2,y+110+i*16);
    }
}

function drawPage(p){
    g.reset();
    g.clearRect(0,68,w-1,h-1);
    var O = w/2-24*(Npages/2);
    for (var j=0;j<Npages;j++){
        var x = O+j*24;
        g.setColor(g.theme.fg);
        if (j==page) g.fillCircle(x,h-60,8);
        else g.drawCircle(x,h-60,8);
    }
    for (var i=0;i<6;i++) {
        if (!apps[p*6+i]) return i;
        draw_icon(p,i,selected==i);
    }
}

function swipeAction(dir){
    selected = -1;
    if (dir==TC.LEFT){
        ++page; if (page>maxPage) page=maxPage;
        drawPage(page);
    } else if (dir==TC.RIGHT){
        --page; if (page<0) page=0;
        drawPage(page);
    }  
}

function isTouched(p,n){
    if (n<0 || n>5) return false;
    var x1 = XOFF+(n%3)*CELL; var y1 = n>2?CELL+YOFF:YOFF;
    var x2 = x1+CELL; var y2 = y1+CELL;
    return (p.x>x1 && p.y>y1 && p.x<x2 && p.y<y2);
}

function touchAction(p){
    var i;
    for (i=0;i<6;i++){
        if((page*6+i)<Napps){
            if (isTouched(p,i)) {
                draw_icon(page,i,true);
                if (selected>=0) {
                    if (selected!=i){
                        draw_icon(page,selected,false);
                    } else {
                        wOS.sleep();
                        load(apps[page*6+i].src);
                    }
                }
                selected=i;
                break;
            }
        }
    }
    if ((i==6 || (page*6+i)>Napps) && selected>=0) {
        draw_icon(page,selected,false);
        selected=-1;
    }
}  

function setControls(){
    Bangle.setUI(); //clear out any handlers
    TC.swipeHandler = swipeAction;
    TC.touchHandler = touchAction;
    TC.on("swipe", TC.swipeHandler);
    TC.on("touch", TC.touchHandler);
}

global.SCREENACCESS = {
    request:function(){
    },
    release:function(){
      drawPage(page);
      setControls();
    }
  }; 

Bangle.loadWidgets();
Bangle.drawWidgets();
drawPage(0);
setControls();


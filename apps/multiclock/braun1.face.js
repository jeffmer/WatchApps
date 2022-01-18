(() => {

    function getFace(){
      var W = g.getWidth(),R=W/2;
      var H = g.getHeight();
      var cx = W/2;
      var cy = H/2;
      var Grey = g.toColor(0.8,0.8,0.8);
  
      Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
          var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
          return this.fillPoly(this.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
            {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
      }
        
      function dial() {
        for (let a=0;a<360;a+=6)
        if (a % 30 != 0) {
          var theta=a*Math.PI/180;
          g.setColor(Grey).drawLine(cx,cy,cx+170*Math.sin(theta),cy-170*Math.cos(theta));
        }
        g.clearRect(16,16,W-16,H-16);
        for (let a=0;a<360;a+=30)
          g.setColor(1,1,1).drawRotRect(2,R-100,170,a);
        g.clearRect(24,24,W-24,H-24);
        g.flip();
    }
  
  
    var numpos = (()=>{
      var d = 95;
      var e = 10;
      var s = function(a){
        var off = Math.floor(d*Math.sin(a*30*Math.PI/180));
        return off+cx;
      };
      var c = function(a){
        var off= Math.floor(d*Math.cos(a*30*Math.PI/180));
        return cy-off;
      };                   
      var p = new Int16Array(24);
      for (var i=0;i<12; ++i){p[2*i]=s(i); p[2*i+1]=c(i);}
      p[1]=p[1]+e;   p[23]=p[1]; p[3]=p[1];
      p[6]=p[6]-e;   p[4]=p[6]; p[8]=p[6];
      p[13]=p[13]-e+2; p[11]=p[13]; p[15]=p[13];
      p[18]=p[18]+e; p[16]=p[18]; p[20]=p[18];
      return p;
    })();
  
    Graphics.prototype.setFontRoboto = function(scale) {  this.setFontCustom(atob("AAAAMAAwAAAAGAB4A+AfAPgAwAAAAAAAf+D/8MAwwDDAMP/wf+AAAAAAYABgAEAA//D/8AAAAAAAAAAAcDDgcMDww5DHEP4QeBAAEAAAYODgcMQwxjDOMP/we+AAAACAA4AHgByAcID/8P/wAIAAgAAADMD8YOwwzDDMMM5wx+ABgAAAH8B/4GwwzDDMMI/wB+AAAIAAgACAMIDwg8CPAPwA4ACAAAAAe+D/8M4wxDDOMP/we+AAAAAAfgD3EMMwwTDDcH/gP4AAAAAAGDAYMAAA"), 46, atob("BAcJCQkJCQkJCQkJBA=="), 16+(scale<<8)+(1<<16));
    return this;
  };
  
    function numdial(notfirst){
      g.setColor(g.theme.fg);
      if (!notfirst)
      for (let a=0;a<12;++a){
         g.setFontAlign(0,0).setFontRoboto();
         var s = ("0"+(a==0?60:a*5)).substr(-2);    
         g.setColor(Grey).drawString(s,numpos[a*2],numpos[a*2+1]);
      } else  for (let a=0;a<12;a+=3){
        g.setFontAlign(0,0).setFontRoboto();
        var s = ("0"+(a==0?60:a*5)).substr(-2);    
        g.setColor(Grey).drawString(s,numpos[a*2],numpos[a*2+1]);
     }
    }
  
    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = g.drawRotRect.bind(g,5,6,R-56);
        let mh = g.drawRotRect.bind(g,3,6,R-32);
        let sh = g.drawRotRect.bind(g,2,3,R-30);
        g.setColor(g.theme.bg);
        sh(secondDate.getSeconds()*6);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(minuteDate.getHours()*30 + minuteDate.getMinutes()/2);
            mh(minuteDate.getMinutes()*6);
            minuteDate = new Date();
            initDate();
        }
        numdial(true);
        drawDate();
        g.setColor(g.theme.fg);
        hh(minuteDate.getHours()*30 + minuteDate.getMinutes()/2);
        mh(minuteDate.getMinutes()*6);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 6);
        g.setColor(1,0.5,0);
        secondDate = new Date();
        sh(secondDate.getSeconds()*6);
        g.fillCircle(cx, cy, 3);
        g.flip();
    }


    var buf = Graphics.createArrayBuffer(16,12,1,{msb:true});

    Graphics.prototype.setFontRobotoSmall = function(scale) {
      // Actual height 10 (10 - 1)
      this.setFontCustom(atob("AAAGAAAAwB4HgOAMAAQB/BgwgIYEP+B8AAAgAwAf8P+AAAAAQA4YYcIaGZD4gQQAAccMiERDch/wIgAQA4A0ByB/w/4AQAAH2D5hIQmIT8I8AAA/A8w0ISEJ+AeCABAAgYQ4JwHgDAAAAd4bsIiGxD/gRgMAPgMyEJDNg/gPAAADGAA="), 46, atob("AwUHBwcHBwcHBwcHAw=="), 13+(scale<<8)+(1<<16));
      return this;
    }
  
    function initDate(){
      var date = ('0' + minuteDate.getDate()).substr(-2);
      buf.clear().setFont("RobotoSmall").setFontAlign(0,0).setColor(1).drawString(date,8,6);
    }

    function drawDate(){
       g.setColor(1,0,0).fillRect(cx-8,H-69,cx+7,H-66)
       g.setBgColor(-1).setColor(0).drawImage({width:16,height:12,buffer:buf.buffer},cx-8,H-65);
       g.setBgColor(0).setColor(-1);
    }  


    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) {dial();numdial();}
        initDate(); drawDate();
        var hrs = minuteDate.getHours();
        hrs = hrs>12?hrs-12:hrs;
        //Bangle.drawWidgets(hrs>=3 && hrs<9?50:166);
        onSecond(notfirst);
        return true;
    }
 
    return {init:drawAll, tick:onSecond, tickpersec:true};
 }

return getFace;

})();
(() => {

    function getFace(){

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2

    Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
        var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
        return this.fillPoly(g.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
          {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
    }
      
    function bezel() {
        for (let a=0;a<360;a+=6)
        if (a % 90 == 0) 
            g.setColor(g.theme.fg).drawRotRect(8,105,120,a);
        else if (a % 30 == 0)
            g.setColor(g.theme.fg).drawRotRect(4,105,120,a);
        else 
            g.setColor(0.6,0.6,0.6).drawRotRect(2,110,120,a);
    }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = g.drawRotRect.bind(g,6,6,66);
        let mh = g.drawRotRect.bind(g,3,6,100);
        let sh = g.drawRotRect.bind(g,2,3,100);
        g.setColor(g.theme.bg);
        sh(360*secondDate.getSeconds()/60);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
            mh(360*minuteDate.getMinutes()/60);
            minuteDate = new Date();
        }
        drawDate();
        g.setColor(g.theme.fg);
        hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
        mh(360*minuteDate.getMinutes()/60);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 6);
        g.setColor(1,0,0);
        secondDate = new Date();
        sh(360*secondDate.getSeconds()/60);
        g.fillCircle(cx, cy, 3);
    }


    var buf = Graphics.createArrayBuffer(24,20,1,{msb:true});

    function initDate(){
      var date = ('0' + minuteDate.getDate()).substr(-2);
      buf.clear().setFont("Vector",18).setFontAlign(0,0).setColor(1).drawString(date,12,10);
    }

    function drawDate(x,y){
       g.setBgColor(-1).setColor(0).drawImage({width:24,height:20,buffer:buf.buffer},190,110);
       g.setBgColor(0).setColor(-1);
    }  


    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) bezel();
        initDate(); drawDate();
        var hrs = minuteDate.getHours();
        hrs = hrs>12?hrs-12:hrs;
        Bangle.drawWidgets(hrs>=3 && hrs<9?50:166);
        onSecond(notfirst);
        return true;
    }
 
    return {init:drawAll, tick:onSecond, tickpersec:true};
 }

return getFace;

})();

(() => {

    function getFace(){

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2;

    Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
        var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
        return this.fillPoly(this.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
          {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
    }
      
    function dial(r) {
        for (let a=0;a<360;a+=6)
        if (a % 90 == 0) 
            g.setColor(g.theme.fg).drawRotRect(16,r-20,r,a);
        else if (a % 30 == 0)
            g.setColor(g.theme.fg).drawRotRect(8,r-20,r,a);
        else 
            g.setColor(0.6,0.6,0.6).drawRotRect(4,r-10,r,a);
    }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = g.drawRotRect.bind(g,12,12,cx-70);
        let mh = g.drawRotRect.bind(g,6,12,cx-25);
        let sh = g.drawRotRect.bind(g,4,6,cx-25);
        g.setColor(g.theme.bg);
        sh(secondDate.getSeconds()*6);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(minuteDate.getHours()*30 + minuteDate.getMinutes()/2);
            mh(minuteDate.getMinutes()*6);
            minuteDate = new Date();
        }
        drawDate();
        g.setColor(g.theme.fg);
        hh(minuteDate.getHours()*30 + minuteDate.getMinutes()/2);
        mh(minuteDate.getMinutes()*6);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 12);
        g.setColor(1,0,0);
        secondDate = new Date();
        sh(secondDate.getSeconds()*6);
        g.fillCircle(cx, cy, 6);
    }


    var buf = Graphics.createArrayBuffer(44,36,1,{msb:true});

    function initDate(){
      var date = ('0' + minuteDate.getDate()).substr(-2);
      buf.clear().setFont("Vector",32).setFontAlign(0,0).setColor(1).drawString(date,23,20);
    }

    function drawDate(x,y){
       g.setBgColor(-1).setColor(0).drawImage({width:44,height:36,buffer:buf.buffer},360,207);
       g.setBgColor(0).setColor(-1);
    }  


    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) dial(cx);
        initDate(); drawDate();
        var hrs = minuteDate.getHours();
        hrs = hrs>12?hrs-12:hrs;
        Bangle.drawWidgets(320);
        onSecond(notfirst);
        return true;
    }
 
    return {init:drawAll, tick:onSecond, tickpersec:true};
 }

return getFace;

})();

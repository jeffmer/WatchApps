eval(require("Storage").read("lcd-g5.js"));

function sleep(){
  g.brightness(0);
  g.lcd_sleep();
}

function wake(){
  g.lcd_wake();
  g.brightness(255);
}

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2;

    Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
        var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
        return this.fillPoly(this.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
          {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
    }
      
    function dial() {
        for (let a=0;a<360;a+=6)
        if (a % 90 == 0) 
            g.setColor(g.theme.fg).drawRotRect(8,105,cx,a);
        else if (a % 30 == 0)
            g.setColor(g.theme.fg).drawRotRect(4,105,cx,a);
        else 
            g.setColor(0.6,0.6,0.6).drawRotRect(2,110,cx,a);
    }

var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = g.drawRotRect.bind(g,6,6,66);
        let mh = g.drawRotRect.bind(g,3,6,100);
        let sh = g.drawRotRect.bind(g,2,3,100);
        g.setColor(g.theme.bg);
        sh(secondDate.getSeconds()*6);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(minuteDate.getHours()*30 + minuteDate.getMinutes()/2);
            mh(minuteDate.getMinutes()*6);
            minuteDate = new Date();
        }
        g.setColor(g.theme.fg);
        hh(minuteDate.getHours()*30 + minuteDate.getMinutes()/2);
        mh(minuteDate.getMinutes()*6);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 6);
        g.setColor(1,0,0);
        secondDate = new Date();
        sh(secondDate.getSeconds()*6);
        g.fillCircle(cx, cy, 3);
    }

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) dial();
        var hrs = minuteDate.getHours();
        hrs = hrs>12?hrs-12:hrs;
        onSecond(notfirst);
        return true;
    }

g.clear();
drawAll();
setInterval(onSecond,1000);


(() => {

    function getFace(){

    const p = Math.PI/2;
    const PRad = Math.PI/180;

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2


    function drawRotRect(angle, w, r1,r2) {
        var a = angle*PRad;
        let fn = Math.ceil;
        var sina = Math.sin(a);
        var cosa = Math.cos(a);
        const cx = 120;
        const cy = 120;
        var x0 = -w/2;
        var x1 = +w/2; 
        var y0 = r1;
        var y1 = r2;
        g.fillPoly([
          fn(cx - x0*cosa + y0*sina), fn(cy - x0*sina - y0*cosa),
          fn(cx - x1*cosa + y0*sina), fn(cy - x1*sina - y0*cosa),
          fn(cx - x1*cosa + y1*sina), fn(cy - x1*sina - y1*cosa),
          fn(cx - x0*cosa + y1*sina), fn(cy - x0*sina - y1*cosa)
        ]);
      }

    function marks(angle,r) {
        if (angle % 90 == 0) {
            g.setColor(g.theme.fg);
            drawRotRect(angle,12,95,120);
        } else if (angle % 30 == 0){
            g.setColor(g.theme.fg);
            drawRotRect(angle,8,103,120);
        } else {
            g.setColor(0.7,0.7,0.7);
            drawRotRect(angle,4,110,120);
        }
    }

    function hand(angle, w, r) {
        drawRotRect(angle, w, 12,r);
    }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        g.setColor(g.theme.bg);
        hand(360*secondDate.getSeconds()/60,2,95);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12,10,75);
            hand(360*minuteDate.getMinutes()/60,6,90);
            minuteDate = new Date();
        }
        g.setColor(1,0,0);
        secondDate = new Date();
        hand(360*secondDate.getSeconds()/60,2,95);
        g.setColor(g.theme.fg);
        hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12,10,75);
        hand(360*minuteDate.getMinutes()/60,6,90);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 12);
        g.setColor(g.theme.bg);
        g.fillCircle(cx, cy, 6);
    }

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) {
        for (let i=0;i<60;i++)
            marks(360*i/60, g.getWidth()/2);
        }100
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
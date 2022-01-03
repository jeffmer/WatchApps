(() => {

    function getFace(){

    const p = Math.PI/2;
    const PRad = Math.PI/180;

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2


    function drawRotRect(w, r1,r2, angle) {
        var a = angle*PRad;
        let fn = Math.ceil;
        var sina = Math.sin(a);
        var cosa = Math.cos(a);
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
            drawRotRect(8,105,120,angle);
        } else if (angle % 30 == 0){
            g.setColor(g.theme.fg);
            drawRotRect(4,105,120,angle);
        } else {
            g.setColor(0.6,0.6,0.6);
            drawRotRect(2,110,120,angle);
        }
    }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = drawRotRect.bind(null,6,6,66);
        let mh = drawRotRect.bind(null,3,6,100);
        let sh = drawRotRect.bind(null,2,3,100);
        g.setColor(g.theme.bg);
        sh(360*secondDate.getSeconds()/60);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
            mh(360*minuteDate.getMinutes()/60);
            minuteDate = new Date();
        }
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

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) {
        for (let i=0;i<60;i++)
            marks(360*i/60, g.getWidth()/2);
        }
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

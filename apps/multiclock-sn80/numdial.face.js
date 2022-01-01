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

      function bezel(r){
        g.setColor(g.theme.fg);
        g.setFontRobotoSmall();
        g.setFontAlign(0,0);
        for (var i = 1; i<=12; ++i){
            var a = i*PRad;
            let x = cx+Math.sin(a*30)*r;
            let y = cy-Math.cos(a*30)*r
            if (i==12 || i==11 || i==1) y+=3;
            g.drawString(i,x,y);
        }
      }


    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = drawRotRect.bind(null,6,6,60);
        let mh = drawRotRect.bind(null,3,6,90);
        let sh = drawRotRect.bind(null,2,3,90);
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
        if (!notfirst) bezel(108);
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

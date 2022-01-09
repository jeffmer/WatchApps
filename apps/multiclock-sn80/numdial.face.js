(() => {

    function getFace(){
    const PRad = Math.PI/180;

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2



    function drawRotRect(w, r1, r2, angle) {
      var w2=w/2, ll=r2-r1, theta=(angle+270)*PRad;
      g.fillPoly(g.transformVertices([0,-w2,ll,-w2,ll,w2,0,w2], 
        {x:cx+r1*Math.cos(theta),y:cy+r1*Math.sin(theta),rotate:theta}));
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

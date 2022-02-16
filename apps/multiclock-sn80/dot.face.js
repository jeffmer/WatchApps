(() => {

    function getFace(){

    const PRad = Math.PI/180;

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2;
    
    function bezel(r){
        g.setColor(g.theme.fg);
        g.setFontRoboto();
        g.setFontAlign(0,0);
        g.drawString("12",120,26);
        g.drawString("6",120,220);
        g.drawString("9",20,120);
        g.drawString("3",220,120);
        g.setColor(g.theme.fg2);
        for (var i = 0; i<360; i+=30){
            var a = i*PRad;
            if (i%90!=0) g.fillCircle(cx+Math.sin(a)*r,cy-Math.cos(a)*r,4);
        }
    }

    function hand(r1, r2, r3, angle) {
        var theta=(angle+270)*PRad;
        g.fillPoly(g.transformVertices([r1,0,0,-r3,r2,0,0,r3], 
          {x:cx,y:cy,rotate:theta}));
      }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        g.setColor(g.theme.bg);
        var sh = hand.bind(null,-16, cx-40, 4);
        var mh = hand.bind(null,-16, cx-40, 7);
        var hh = hand.bind(null,-16, 65, 7);
        sh(360*secondDate.getSeconds()/60);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
            mh(360*minuteDate.getMinutes()/60);
            minuteDate = new Date();
        }
        g.setColor(g.theme.fg);
        hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
        g.setColor(g.theme.fg2);
        mh(360*minuteDate.getMinutes()/60);
        g.setColor(1,0,0);
        secondDate = new Date();
        sh(360*secondDate.getSeconds()/60);
        g.setColor(0,0,0).fillCircle(cx,cy,2);
    }

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) bezel(cx-20);
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

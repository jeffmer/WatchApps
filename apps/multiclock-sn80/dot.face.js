(() => {

    function getFace(){

    const PRad = Math.PI/180;

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2;
    var scale = 0.9;


      
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

    function drawRotRect(w, r1, r2, angle) {
        var w2=w/2, ll=r2-r1, theta=(angle+270)*PRad;
        g.fillPoly(g.transformVertices([0,-w2,ll,-w2,ll,w2,0,w2], 
          {x:cx+r1*Math.cos(theta),y:cy+r1*Math.sin(theta),rotate:theta}));
    }

    var secondhand = drawRotRect.bind(null,2,2,90*scale);

    function hand(angle, r1, r2, r3) {
        r1 = scale*r1; r2=scale*r2; r3 = scale*r3;
        var theta=(angle+270)*PRad;
        g.fillPoly(g.transformVertices([r1,0,0,-r3,r2,0,0,r3], 
          {x:cx,y:cy,rotate:theta}));
      }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        g.setColor(g.theme.bg);
        secondhand(360*secondDate.getSeconds()/60);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12, -16, 70, 7);
            hand(360*minuteDate.getMinutes()/60, -16, 86, 7);
            minuteDate = new Date();
        }
        g.setColor(1,0,0);
        secondDate = new Date();
        secondhand(360*secondDate.getSeconds()/60);
        g.setColor(g.theme.fg);
        hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12, -16, 70, 7);
        hand(360*minuteDate.getMinutes()/60, -16, 86, 7);
        g.setColor(g.theme.bg);
        g.fillCircle(cx,cy,2);
    }

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) bezel(100);
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

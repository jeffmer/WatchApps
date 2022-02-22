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
        g.setFontRoboto();
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
        let hh = drawRotRect.bind(null,12,12,cx-90);
        let mh = drawRotRect.bind(null,6,12,cx-45);
        let sh = drawRotRect.bind(null,4,6,cx-45);
        g.setColor(g.theme.bg);
        sh(360*secondDate.getSeconds()/60);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
            mh(360*minuteDate.getMinutes()/60);
            minuteDate = new Date();
            setSteps();
        }
        drawSteps();
        if (!WIDCNTRL.hide) Bangle.drawWidgets(320);
        g.setColor(g.theme.fg);
        hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
        mh(360*minuteDate.getMinutes()/60);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 12);
        g.setColor(1,0,0);
        secondDate = new Date();
        sh(360*secondDate.getSeconds()/60);
        g.fillCircle(cx, cy, 6);
    }
    var buf = Graphics.createArrayBuffer(80,24,1,{msb:true});

    function setSteps(){
      var steps = ('0000' + E.totalSteps()).substr(-5);
      buf.clear().setFont("RobotoSmall").setFontAlign(0,0).setColor(1).drawString(steps,40,14);
    }

    function drawSteps(){
       if (!wOS.STEPS) return;
       g.setBgColor(-1).setColor(0).drawImage({width:80,height:24,buffer:buf.buffer},cx-40,350);
       g.setBgColor(0).setColor(-1);
    }  

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) bezel(cx-24);
        setSteps(); drawSteps();
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

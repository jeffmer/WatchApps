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
            setSteps();
        }
        drawSteps();
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
    var buf = Graphics.createArrayBuffer(40,12,1,{msb:true});

    Graphics.prototype.setFontRobotoTiny = function(scale) {
      // Actual height 10 (10 - 1)
      this.setFontCustom(atob("AAAGAAAAwB4HgOAMAAQB/BgwgIYEP+B8AAAgAwAf8P+AAAAAQA4YYcIaGZD4gQQAAccMiERDch/wIgAQA4A0ByB/w/4AQAAH2D5hIQmIT8I8AAA/A8w0ISEJ+AeCABAAgYQ4JwHgDAAAAd4bsIiGxD/gRgMAPgMyEJDNg/gPAAADGAA="), 46, atob("AwUHBwcHBwcHBwcHAw=="), 13+(scale<<8)+(1<<16));
      return this;
    };

    function setSteps(){
      var steps = ('0000' + E.totalSteps()).substr(-5);
      buf.clear().setFont("RobotoTiny").setFontAlign(0,0).setColor(1).drawString(steps,20,6);
    }

    function drawSteps(){
       if (!wOS.STEPS) return;
       g.setBgColor(-1).setColor(0).drawImage({width:40,height:12,buffer:buf.buffer},cx-20,175);
       g.setBgColor(0).setColor(-1);
    }  

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) bezel(108);
        setSteps(); drawSteps();
        var hrs = minuteDate.getHours();
        hrs = hrs>12?hrs-12:hrs;
        Bangle.drawWidgets(50);
        onSecond(notfirst);
        return true;
    }
 
    return {init:drawAll, tick:onSecond, tickpersec:true};
 }

return getFace;

})();

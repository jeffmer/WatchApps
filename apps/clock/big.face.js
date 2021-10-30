(() => {

    function getFace(){

    var W = g.getWidth();
    var H = g.getHeight();
    var F = H/2;

    function drawTime(d) {
        g.reset();
        var da = d.toString().split(" ");
        var time = da[4].substr(0, 5).split(":");
        var hours = time[0],
          minutes = time[1];
        g.clearRect(0,24,W-1,H-1);
        g.setColor(g.theme.fg);
        g.setFont("Vector",F);
        g.setFontAlign(0,-1);
        g.drawString(hours,W/2,30,true);
        g.setColor(g.theme.fg2);
        g.drawString(minutes,W/2,15+F,true);
      }

    function onSecond(){
       var t = new Date();
       if (t.getSeconds() === 0) drawTime(t);
    }

    function drawAll(){
       drawTime(new Date());
    }

    return {init:drawAll, tick:onSecond};
    }

  return getFace;

})();
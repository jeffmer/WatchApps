(() => {
    function getFace(){

      var W = g.getWidth();
      var H = g.getHeight();
        
        var lastmin=-1;
        function drawClock(){
          var d=Date();
          if (d.getMinutes()==lastmin) return;
          d=d.toString().split(' ');
          var min=d[4].substr(3,2);
          var sec=d[4].substr(-2);
          var tm=d[4].substring(0,5);
          var hr=d[4].substr(0,2);
          lastmin=min;
          g.reset();
          g.clearRect(0,24,W-1,H-1);
          g.setColor(g.theme.fg);
          g.setFontAlign(0,-1);
          g.setFontVector(80);
          g.drawString(tm,4+W/2,H/2-80);
          g.setFontVector(36);
          g.setColor(g.theme.fg2);
          var dt=d[0]+" "+d[1]+" "+d[2];//+" "+d[3];
          g.drawString(dt,W/2,H/2);
          g.flip();
        }

        function drawFirst(){
          lastmin=-1;
          drawClock();
        }

        return {init:drawFirst, tick:drawClock};
     }

    return getFace;

})();


(() => {

    function getFace(){

    const W = g.getWidth();
    const H = g.getHeight();
    const F = 48;

    function drawTime() {
        var steps = E.totalSteps();
        g.reset();
        g.clearRect(0,24,W-1,H-1);
        g.setColor(g.theme.fg).setFont("Vector",F).setFontAlign(0,0);
        g.drawString("Steps\n"+steps,W/2,H/2+12,true);
      }


    return {init:drawTime, tick:drawTime, tickpersecond:false};
    }

  return getFace;

})();
(function(){
  
    function draw() {
      g.setColor(g.theme.fg);
      if (wOS.settings.steps) 
        g.setFont("Vector",16).setFontAlign(0,0).drawString(("000"+E.totalSteps()).substr(-4),this.x+20,this.y+12);
      else
        g.setFont("Vector",16).setFontAlign(0,0).drawString("    ",this.x+20,this.y+12);
    }
  
    WIDGETS["step"]={area:"tr",width:40,draw:draw};
  })()
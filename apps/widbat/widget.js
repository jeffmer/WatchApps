(function(){
  var CHARGING = 0x07E0;

  function setWidth() {
    WIDGETS["bat"].width = 40 + (wOS.isCharging()?16:0);
  }

  function draw() {
    var s = 39;
    var x = this.x, y = this.y;
    if (wOS.isCharging()) {
      g.setColor(CHARGING).drawImage(atob("DhgBHOBzgc4HOP////////////////////3/4HgB4AeAHgB4AeAHgB4AeAHg"),x,y);
      x+=16;
    }
    g.setColor(-1);
    g.fillRect(x,y+2,x+s-4,y+21);
    g.clearRect(x+2,y+4,x+s-6,y+19);
    g.fillRect(x+s-3,y+10,x+s,y+14);
    g.setColor(CHARGING).fillRect(x+4,y+6,x+4+E.getBattery()*(s-12)/100,y+17);
    g.setColor(-1);
  }

  wOS.on('charging',function(charging) {
    setWidth();
    wOS.drawWidgets(); // relayout widgets
    g.flip();
  });

  WIDGETS["bat"]={area:"tr",width:40,draw:draw};
  setWidth();
})()


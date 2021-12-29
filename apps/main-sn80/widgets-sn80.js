wOS.drawWidgets = function(Y) {
    var w=g.getWidth(), h=g.getHeight();
    if(!Y) Y=10;
    var pos = {
        tl:{x:120, y:Y, r:1, c:0}, // if r==1, we're right->left
        tr:{x:120, y:Y, r:0, c:0},
    };
    if (global.WIDGETS) {
      for (var wd of WIDGETS) {
        var p = pos[wd.area];
        if (!p) return;
        wd.x = p.x - p.r*wd.width;
        wd.y = p.y;
        p.x += wd.width*(1-2*p.r);
        p.c++;
      }
      g.reset();
      if (pos.tl.c || pos.tr.c) g.clearRect(pos.tl.x,Y,pos.tr.x,Y+23);
      for (wd of WIDGETS) wd.draw(wd);
    }
  };

  wOS.loadWidgets = function() {
    global.WIDGETS={};
    require("Storage").list(/\.wid\.js$/).forEach(widget=>eval(require("Storage").read(widget)));
  };
  
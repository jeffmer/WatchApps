wOS.drawWidgets = function(Y) {
    var w=g.getWidth(), h=g.getHeight();
    if(typeof Y==undefined) Y=WIDCNTRL.Yoffset; else WIDCNTRL.Yoffset=Y;
    var pos = {
        tl:{x:113, y:Y, r:1, c:0}, // if r==1, we're right->left
        tr:{x:113, y:Y, r:0, c:0},
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
      if (!global.WIDCNTRL.hide) for (wd of WIDGETS) wd.draw(wd);
    }
  };

  wOS.loadWidgets = function(hide) {
    global.WIDGETS={};
    global.WIDCNTRL={hide:false,Yoffset:10};
    if (typeof hide!=undefined) WIDCNTRL.hide = hide;
    require("Storage").list(/\.wid\.js$/).forEach(widget=>eval(require("Storage").read(widget)));
    TC.on('touch',(pt)=>{
      if (pt.y<60) {
        WIDCNTRL.hide = !WIDCNTRL.hide;
        wOS.drawWidgets();
      }
    });    
  };
  
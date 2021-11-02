wOS.setUI =function(mode, cb) {
    if (wOS.btnWatches) {
      wOS.btnWatches.forEach(clearWatch);
      delete wOS.btnWatches;
    }
    if (TC.swipeHandler) {
      TC.removeListener("swipe", TC.swipeHandler);
      delete TC.swipeHandler;
    }
    if (TC.touchHandler) {
      TC.removeListener("touch", TC.touchHandler);
      delete TC.touchHandler;
    }
    if (!mode) return;
    else if (mode=="updown") {
        wOS.btnWatches = [
          setWatch(function() { cb(-1); }, BTN1, {repeat:1}),
          setWatch(function() { cb(1); }, BTN2, {repeat:1}),
        ];
        TC.swipeHandler = d => {if (d==2) cb(-1); else if (d==1)  cb(1);};
        TC.on("swipe", TC.swipeHandler);
        TC.touchHandler = d => {cb();};
        TC.on("touch", TC.touchHandler);
    }
    else if (mode=="leftright") {
        wOS.btnWatches = [
          setWatch(function() {cb();}, BTN1, {repeat:1,edge:"rising"}),
        ];
        TC.swipeHandler = d => {if (d==3) cb(-1); else if (d==4)  cb(1);};
        TC.on("swipe", TC.swipeHandler);
    } else if (mode=="clock") {
        wOS.btnWatches = [
          setWatch(function() {if (wOS.awake) wOS.showLauncher(); }, BTN1, {repeat:1,edge:"rising"}),
        ];
    } else if (mode=="touch") {
      wOS.btnWatches = [
        setWatch(function() {if (wOS.awake) load("launch.js"); }, BTN1, {repeat:1,edge:"rising"}),
      ];
      TC.touchHandler = d => {cb(d);};
      TC.on("touch", TC.touchHandler);
    } else
      throw new Error("Unknown UI mode");
  }
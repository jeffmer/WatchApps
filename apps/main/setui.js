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
    else if (mode=="clock") {
        wOS.btnWatches = [
          setWatch(function() { load("launch.js"); }, BTN1, {repeat:1}),
        ];
        TC.swipeHandler = d => {if (d==3) cb(-1); else if (d==4)  cb(1);};
        TC.on("swipe", TC.swipeHandler);
    } else
      throw new Error("Unknown UI mode");
  }
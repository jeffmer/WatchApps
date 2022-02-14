wOS.setUI =function(mode, cb) {
    function tt() {if (wOS.awake) setTimeout(cb,10);else wOS.wake();}
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
          setWatch(tt, BTN1, {repeat:1,edge:"falling"}),
        ];
        TC.swipeHandler = d => {if (d==2) cb(-1); else if (d==1)  cb(1);};
        TC.on("swipe", TC.swipeHandler);    }
    else if (mode=="leftright") {
        wOS.btnWatches = [
          setWatch(tt, BTN1, {repeat:1,edge:"falling"}),
        ];
        TC.swipeHandler = d => {if (d==3) cb(-1); else if (d==4)  cb(1);};
        TC.on("swipe", TC.swipeHandler);
    } else if (mode=="clock") {
        wOS.btnWatches = [
          setWatch(function() {if (wOS.awake) wOS.showLauncher();else wOS.wake();}, BTN1, {repeat:1,edge:"falling"}),
        ];
    } else if (mode=="clockupdown") {
        wOS.btnWatches = [
          setWatch(function() {if (wOS.awake) wOS.showLauncher();else wOS.wake();}, BTN1, {repeat:1,edge:"falling"}),
        ];
        TC.swipeHandler = d => {if (d==2) cb(-1); else if (d==1)  cb(1);};
        TC.on("swipe", TC.swipeHandler);    
    } else if (mode=="touch") {
      wOS.btnWatches = [
        setWatch(function() {if (wOS.awake) wOS.showLauncher();else wOS.wake();}, BTN1, {repeat:1,edge:"falling"}),
      ];
      TC.touchHandler = d => {cb(d);};
      TC.on("touch", TC.touchHandler);
    } else
      throw new Error("Unknown UI mode");
  }
wOS.setUI =function(mode, cb) {
    function tt() {setTimeout(cb,10);}
    if (TC.longHandler) {
      TC.removeListener("longtouch", TC.longHandler);
      delete TC.longHandler;
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
       TC.longHandler = tt;
       TC.on("longtouch", TC.longHandler);  
        TC.swipeHandler = d => {if (d==2) cb(-1); else if (d==1)  cb(1);};
        TC.on("swipe", TC.swipeHandler);}
    else if (mode=="leftright") {
      TC.longHandler = tt;
      TC.on("longtouch", TC.longHandler);  
        TC.swipeHandler = d => {if (d==3) cb(-1); else if (d==4)  cb(1);};
        TC.on("swipe", TC.swipeHandler);
    } else if (mode=="clock") {
      TC.longHandler = function() {if (wOS.awake) wOS.showLauncher(); }
      TC.on("longtouch", TC.longHandler);  
    } else if (mode=="clockupdown") {
      TC.longHandler = function() {if (wOS.awake) wOS.showLauncher(); }
      TC.on("longtouch", TC.longHandler);  
        TC.swipeHandler = d => {if (d==2) cb(-1); else if (d==1)  cb(1);};
        TC.on("swipe", TC.swipeHandler);    
    } else if (mode=="touch") {
      TC.longHandler = function() {if (wOS.awake) wOS.showLauncher(); }
      TC.on("longtouch", TC.longHandler);  
      TC.touchHandler = d => {cb(d);};
      TC.on("touch", TC.touchHandler);
    } else
      throw new Error("Unknown UI mode");
  }
E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,5000);
E.enableWatchdog(20, false);
E.showMessage = function(msg,title) {}

var STOR = require("Storage");
if (STOR.read("main-g5.js") && !BTN2.read()) eval(STOR.read("main-g5.js"));

 if (typeof(g)=='undefined') {
    // dummy g for loader
    g = Graphics.createArrayBuffer(8,8,1);
    g.flip = function() {}; 
}

D7.set();
E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,5000);
E.enableWatchdog(20, false);
E.showMessage = function(msg,title) {}

var STOR = require("Storage");
if (STOR.read("main.js")) eval(STOR.read("main.js"));


// This runs after a 'fresh' boot
eval(STOR.read("config_bma421.js"));
ACCEL.motionInit();
E.stepInit();
Bangle.buzz(50);
var clockApp=(require("Storage").readJSON("settings.json",1)||{}).clock;
if (clockApp) clockApp = require("Storage").read(clockApp);
if (!clockApp) {
  clockApp = require("Storage").list(/\.info$/)
    .map(file => {
      const app = require("Storage").readJSON(file,1);
      if (app && app.type == "clock") {
        return app;
      }
    })
    .filter(x=>x)
    .sort((a, b) => a.sortorder - b.sortorder)[0];
  if (clockApp)
    clockApp = require("Storage").read(clockApp.src);
}
if (!clockApp) clockApp=`E.showMessage("No Clock Found");setWatch(()=>{Bangle.showLauncher();}, BTN1, {repeat:false,edge:"falling"});`;
eval(clockApp);
delete clockApp;

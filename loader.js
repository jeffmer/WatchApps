/* BLE debug info */
Puck.debug = 3;
/* Are we only putting a single app on a device? If so
apps should all be saved as .bootcde and we write info
about the current app into app.info */
Const.SINGLE_APP_ONLY = true;
/* Assume - until we know more - that we have no command
to show messages. */
Const.HAS_E_SHOWMESSAGE = true;

if (window.location.host=="espruino.com") {
  document.getElementById("apploaderlinks").innerHTML =
    'This is the official Espruino App Loader - you can also try the <a href="https://espruino.github.io/EspruinoApps/">Development Version</a> for the most recent apps.';
} else if (window.location.host=="espruino.github.io") {
  document.title += " [Development]";
  document.getElementById("apploaderlinks").innerHTML =
    'This is the development Espruino App Loader - you can also try the <a href="https://espruino.com/apps/">Official Version</a> for stable apps.';
} else {
  document.title += " [Unofficial]";
  document.getElementById("apploaderlinks").innerHTML =
    'This is not the official Espruino App Loader - you can try the <a href="https://espruino.com/apps/">Official Version</a> here.';
}

(function() {
  let username = "espruino";
  let githubMatch = window.location.href.match(/\/(\w+)\.github\.io/);
  if (githubMatch) username = githubMatch[1];
  Const.APP_SOURCECODE_URL = `https://github.com/${username}/EspruinoApps/tree/master/apps`;
})();

const DEVICEINFO = [ {
    id : "BANGLEJS",
    name : "Bangle.js",
    features : ["BLE","BLEHID","GRAPHICS"],
    img : "https://www.espruino.com/img/BANGLEJS_thumb.jpg"
  }, {
    id : "PUCKJS",
    name : "Puck.js",
    features : ["BLE","BLEHID","NFC"],
    img : "https://www.espruino.com/img/PUCKJS_thumb.jpg"
  }, {
    id : "PIXLJS",
    name : "Pixl.js",
    features : ["BLE","BLEHID","NFC","GRAPHICS"],
    img : "https://www.espruino.com/img/PIXLJS_thumb.jpg"
  }, {
    id : "MDBT42Q",
    name : "MDBT42Q",
    features : ["BLE","BLEHID"],
    img : "https://www.espruino.com/img/MDBT42Q_thumb.jpg"
  }/*, {
    id : "MICROBIT",
    name : "micro:bit",
    features : ["BLE","BLEHID"],
    img : "https://www.espruino.com/img/MICROBIT_thumb.jpg"
  }*/
];

function onFoundDeviceInfo(deviceId, deviceVersion) {
  // check against features shown?
  filterAppsForDevice(deviceId);
}

var originalAppJSON = undefined;
function filterAppsForDevice(deviceId) {
  if (originalAppJSON===undefined)
    originalAppJSON = appJSON;
  if (deviceId=="BANGLEJS") {
    showToast(`Looks like you've got a <a href="https://www.espruino.com/Bangle.js" target="_blank">Bangle.js</a>.
This Espruino App loader will make your Bangle run <b>just a single app</b>. For multiple apps specifically for
Bangle.js, please see the <a href="https://www.banglejs.com/apps">Bangle.js App Loader</a>`, "warning", 20000);
  }

  var device = DEVICEINFO.find(d=>d.id==deviceId);
  if (!device) {
    showToast(`Device ID ${deviceId} not recognised. Some apps may not work`, "warning");
    Const.HAS_E_SHOWMESSAGE = false; // assume no display
    appJSON = originalAppJSON;
  } else {
    // assume showmessage if device has a display
    Const.HAS_E_SHOWMESSAGE = device.features.includes("GRAPHICS");
    // Now filter apps
    appJSON = originalAppJSON.filter(app => {
      // No features needed? all good!
      if (!app.needsFeatures) return true;
      // if every feature satisfied, that's great!
      if (app.needsFeatures.every(feature => device.features.includes(feature)))
        return true;
      // uh-oh
      console.log(`Dropping ${app.id} because ${deviceId} doesn't contain all features`);
      return false;
    });
  }
  refreshLibrary();
}

window.addEventListener('load', (event) => {
  var html = `<div class="columns">
    ${DEVICEINFO.map(d=>`
    <div class="column col-3 col-xs-6">
      <div class="card devicechooser" deviceid="${d.id}">
        <div class="card-header">
          <div class="card-title h5">${d.name}</div>
          <!--<div class="card-subtitle text-gray">...</div>-->
        </div>
        <div class="card-image">
          <img src="${d.img}" alt="${d.name}" class="img-responsive">
        </div>
      </div>
    </div>`).join("\n")}
  </div><div class="columns">
    <div class="column col-12 text-center">
      <p><a href="https://www.espruino.com/Order" target="_blank">Non-Bluetooth Espruino Devices</a> will be added soon.</p>
    </div>
  </div>`;
  showPrompt("Which device?",html,{},false);
  htmlToArray(document.querySelectorAll(".devicechooser")).forEach(button => {
    button.addEventListener("click",event => {
      let button = event.currentTarget;
      let deviceId = button.getAttribute("deviceid");
      hidePrompt();
      console.log(deviceId);
      filterAppsForDevice(deviceId);
    });
  });
});

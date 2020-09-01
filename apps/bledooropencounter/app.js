// http://www.espruino.com/BLE+Advertising
// http://www.espruino.com/Puck.js+Door+Light

var zero = Puck.mag();
var doorOpen = false;
var counter = 0;

function setAdvertising() {
  NRF.setAdvertising({},{manufacturer: 0x0590, manufacturerData:[counter]});
}

function onMag(p) {
  p.x -= zero.x;
  p.y -= zero.y;
  p.z -= zero.z;
  var s = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);
  var open = s<1000;
  if (open!=doorOpen) {
    doorOpen = open;
    digitalPulse(open ? LED1 : LED2, 1,100);
    if (doorOpen) {
      counter++;
      setAdvertising();
    }
  }
}
Puck.on('mag', onMag);
Puck.magOn();
setAdvertising();

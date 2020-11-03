require("puckjsv2-2v05-fix")
var d = 0, lastAccel;
var timeStationary = 0;
var advCounter = 0;

function setAdvertising() {
  NRF.setAdvertising({},{
    showName:false,
    manufacturer:0x0590,
    manufacturerData:JSON.stringify({r:Math.round(d*100)/100})
  });
}

function onAccel(r) {
  lastAccel = r;
  d -= r.gyro.z/768000;
  var a = r.acc;
  a.mag = a.x*a.x + a.y*a.y + a.z*a.z;
  a.ang = Math.atan2(a.y,a.x)/(2*Math.PI);
  if (a.mag < 66000000 || a.mag > 71000000) {
    timeStationary = 0;
  } else {
    if (timeStationary<200) timeStationary++;
    else { // no activity, sleep
      Puck.accelOff();
      sleep();
    }
    if (timeStationary>50) {
      // if stable for a while, re-align turn count
      var nearest = Math.round(d)+a.ang;
      d = d*0.8 + nearest*0.2;
    }
  }
  advCounter++;
  if (advCounter>26) { // once a second
    advCounter = 0;
    setAdvertising();
  }
}

function wake() {
  digitalPulse(LED1,1,10); // indicate awake red
  timeStationary = 0;
  advCounter = 0;
  Puck.removeAllListeners('accel');
  Puck.on("accel", onAccel);
  Puck.accelOn(26); // 26Hz
  Puck.accelWr(0x11, Puck.accelRd(0x11)|0b00001100); // scale to 2000dps
}

function sleep() {
  digitalPulse(LED2,1,10); // indicate sleeping green
  var last = getTime()+2;
  Puck.removeAllListeners('accel');
  Puck.on('accel',function(a) {
    if (getTime()<last) return; // ignore events while accelerometer settles
    require("puckjsv2-accel-movement").off();
    wake();
  });
  require("puckjsv2-accel-movement").on();
}

wake();
setAdvertising();

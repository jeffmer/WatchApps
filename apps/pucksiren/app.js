D2.reset();
D30.reset();
D29.reset();
var LEDA = D1;
var LEDB = D31;
var SPK = D28;

var n = 0;
var lightInterval;

function pattern1() {
  n++;
  LEDA.write(n&1);
  LEDB.write(!(n&1));
  var f = (n&1) ? 800 : 600;
  analogWrite(SPK, 0.5, { freq : f});
}

function pattern2() {
  n++;
  var p = n&15;
  LEDA.write(p==0 || p==2);
  LED3.write(p==6 || p==8);
  LEDB.write(p==12 || p==14);
  var f = (p<8) ? 800 : 600;
  analogWrite(SPK, 0.5, { freq : f});
}

function turnOn() {
  if (lightInterval)
    clearInterval(lightInterval);
  
  if (Math.random()<0.5)
    lightInterval = setInterval(pattern2, 50);
  else 
    lightInterval = setInterval(pattern1, 500);
}

function turnOff() {
  if (lightInterval)
    clearInterval(lightInterval);
  lightInterval = undefined;
  LEDA.reset();
  LEDB.reset();
  LED3.reset();
  SPK.reset();
}

// detect movement
require("puckjsv2-accel-movement").on();
var idleTimeout;
Puck.on('accel',function(a) {  
  if (idleTimeout) clearTimeout(idleTimeout);
  else turnOn();
  idleTimeout = setTimeout(function() {
    idleTimeout = undefined;
    turnOff();
  },5000);  
});

NRF.sleep();
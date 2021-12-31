var FACES = [];
var STOR = require("Storage");
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var lastface = STOR.readJSON("clock.json") || {pinned:0}
var iface = lastface.pinned;
var face = FACES[iface]();
var intervalRefSec;
var intervalRefSec;
var tickTimeout;

Graphics.prototype.setFontRoboto = function(scale) {
  // Actual height 35 (36 - 2)
  g.setFontCustom(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAB8AAAAAAPgAAAAAB8AAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAA8AAAAAA/gAAAAAf8AAAAAf/AAAAAP/AAAAAP/AAAAAP/gAAAAH/gAAAAH/wAAAAD/wAAAAD/wAAAAB/4AAAAB/4AAAAAP8AAAAAB8AAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4AAAAP//8AAAH///4AAD////gAAf///+AAH8AAP4AB8AAAfgAPAAAA8AB4AAAHgAPAAAA8AB4AAAHgAPAAAA8AB4AAAHgAPAAAA8AB8AAAPgAH4AAH4AA/////AAD////wAAP///8AAAf//+AAAAf/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAA8AAAAAAPgAAAAAB4AAAAAAPAAAAAAD4AAAAAAeAAAAAADwAAAAAA8AAAAAAH////8AB/////gAP////8AB/////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AADgAA/AAA8AAP4AAPgAD/AAD8AA/gAA/gAHwAAf8AB8AAH/gAPAAB+8AB4AAfngAPAAH48AB4AB+HgAPAAfg8AB4AH4HgAPAB+A8AB8A/AHgAH4fwA8AA//8AHgAD//AA8AAP/gAHgAAfwAA8AAAAAAHgAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAOAAeAAAHwAD4AAB+AAfgAAfwAD+AAH8AAP4AA+AAAPAAPgDgB8AB4A8AHgAPAHgA8AB4A8AHgAPAHgA8AB4A8AHgAPAHwA8AB4B+AHgAPgP4B8AA/v/gfAAH/+//wAAf/n/+AAB/4f/gAAD8A/wAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAA/AAAAAAP4AAAAAH/AAAAAB/4AAAAA/vAAAAAP54AAAAH8PAAAAB/B4AAAA/gPAAAAP4B4AAAH8APAAAB+AB4AAA/gAPAAAP////8AB/////gAP////8AB/////gAP////8AAAAAPAAAAAAB4AAAAAAPAAAAAAB4AAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAADAfAAAH/4D8AAP//gfwAB//8B/AAP//AD4AB/B4APgAPAeAA8AB4DwAHgAPAeAA8AB4DwAHgAPAeAA8AB4DwAHgAPAfAA8AB4D8APgAPAPwH4AB4B///AAPAH//wAB4Af/8AAPAA/+AAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/4AAAAf//wAAAP///AAAD///+AAB//wfwAAPx4A/AAD4eAB8AA+DwAHgAHgeAA8AA8DgAHgAPA8AA8AB4HgAHgAPAeAA8AB4DwAPgAPAfAD4ABwB/B/AAAAP//wAAAA//8AAAAD//AAAAAH/gAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAPAAAAAAB4AAAAAAPAAAAAAB4AAAAAAPAAAAMAB4AAAHgAPAAAD8AB4AAD/gAPAAB/8AB4AA/8AAPAAf+AAB4AP/AAAPAH/gAAB4H/gAAAPD/wAAAB5/4AAAAP/8AAAAB/8AAAAAP+AAAAAB/AAAAAAPgAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAfgH/AAAP/D/8AAD/8//wAAf/3//AAH//8D4AB8B/APgAPAHwA8AB4A+AHgAPAHgA8AB4A8AHgAPAHgA8AB4A+AHgAPAHwA8AB8B/APgAH4/8D4AA//3//AAD/8//wAAP/D/8AAAfwP/AAAAAAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH+AAAAAD/8AAAAB//wAAAAf//gAAAH/f8AcAA+APwHgAPgA+A8AB4ADwHgAPAAPA8AB4AB4HgAPAAOA8AB4ABwPAAPAAeD4AB8ADg+AAHwA8PwAA/gPP8AAD////AAAP///wAAAf//4AAAA//8AAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAA4AAAfAAPgAAD4AB8AAAfAAPgAABwAA4AAAAAAAAAAAAAAAAAAAAAAAA=="), 46, atob("DBMZGRkZGRkZGRkZCw=="), 45+(scale<<8)+(1<<16));
};

var selfmanage;

function stopdraw(notfirst) {
  if(intervalRefSec) {intervalRefSec=clearInterval(intervalRefSec);}
  if(tickTimeout) {tickTimeout=clearTimeout(tickTimeout);}
  if (!notfirst || !selfmanage) g.clear();
}

function queueMinuteTick() {
  if (tickTimeout) clearTimeout(tickTimeout);
  tickTimeout = setTimeout(function() {
    tickTimeout = undefined;
    face.tick();
    queueMinuteTick();
  }, 60000 - (Date.now() % 60000));
}

function startdraw(notfirst) {
  g.reset();
  selfmanage = face.init(notfirst);
  if (face.tickpersec)
    intervalRefSec = setInterval(face.tick,1000);
  else 
    queueMinuteTick();
  if(!selfmanage) Bangle.drawWidgets(20);
}

var SCREENACCESS = {
  withApp:true,
  request:function(){
    this.withApp=false;
    stopdraw();
  },
  release:function(){
    this.withApp=true;
    startdraw(); 
    setButtons();
  }
}; 

Bangle.on('lcdPower',function(b) {
  if (!SCREENACCESS.withApp) return;
  if (b) {
      startdraw(true);
  } else {
      stopdraw(true);
  }
});

function setButtons(){
  function newFace(inc){
    if (!inc) Bangle.showLauncher();
    else  {
      var n = FACES.length-1;
      iface+=inc;
      iface = iface>n?0:iface<0?n:iface;
      stopdraw();
      face = FACES[iface]();
      startdraw();
    }
  }
  Bangle.setUI("leftright", newFace);
}

E.on('kill',()=>{
    if (iface!=lastface.pinned){
      lastface.pinned=iface;
      STOR.write("clock.json",lastface);
    }
});

Bangle.loadWidgets();
g.clear();
startdraw();
setButtons();




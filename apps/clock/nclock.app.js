var FACES = [];
var STOR = require("Storage");
eval(STOR.read("prompt.js"));
eval(STOR.read("widgets.js"));
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var lastface = STOR.readJSON("clock.json") || {pinned:0}
var iface = lastface.pinned;
var face = FACES[iface]();
var intervalRefSec;

function stopdraw() {
  if(intervalRefSec) {intervalRefSec=clearInterval(intervalRefSec);}
  g.clear();
}

function startdraw() {
  g.reset();
  face.init();
  intervalRefSec = setInterval(face.tick,1000);
  wOS.drawWidgets();
}

wOS.on('sleep',function(b) {
  if (!b) {
      startdraw();
  } else {
      stopdraw();
  }
});

function setButtons(){
  function newFace(inc){
    var n = FACES.length-1;
    iface+=inc;
    iface = iface>n?0:iface<0?n:iface;
    stopdraw();
    face = FACES[iface]();
    startdraw();
  }
  TC.on('swipe',(dir)=>{
    if (dir ==TC.RIGHT) newFace(1);
    else if (dir == TC.LEFT) newFace(-1);
  });
}

E.on('kill',()=>{
    if (iface!=lastface.pinned){
      lastface.pinned=iface;
      STOR.write("clock.json",lastface);
    }
});

TC.on("longtouch", (p)=>{load("clock.app.js");}); 

wOS.loadWidgets();

setTimeout(()=>{
  wOS.brightness(0.2);
  g.clear();
  startdraw();
  setButtons();
},500);




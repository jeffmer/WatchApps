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

var SCREENACCESS = {
  request:function(){
    stopdraw();
  },
  release:function(){
    startdraw(); 
    setButtons();
  }
}; 

wOS.on('lcdPower',function(b) {
  if (!SCREENACCESS.withApp) return;
  if (b) {
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
  wOS.setUI("clock", newFace);
}

E.on('kill',()=>{
    if (iface!=lastface.pinned){
      lastface.pinned=iface;
      STOR.write("clock.json",lastface);
    }
});


wOS.loadWidgets();

setTimeout(()=>{
  g.clear();
  startdraw();
  setButtons();
},500);




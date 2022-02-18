var FACES = [];
var STOR = require("Storage");
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var lastface = STOR.readJSON("clock.json") || {pinned:0}
var iface = lastface.pinned;
var face = FACES[iface]();
var intervalRefSec;
var intervalRefSec;
var tickTimeout;

require("Roboto").add(Graphics);
require("RobotoSmall").add(Graphics);

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

var savedcolor = g.setPaletteColor(g.theme.fg2,0x9f); //swap cyan for pale blue

var SCREENACCESS = {
  withApp:true,
  request:function(){
    this.withApp=false;
    stopdraw();
    g.setPaletteColor(g.theme.fg2,savedcolor);
  },
  release:function(){
    this.withApp=true;
    g.setPaletteColor(g.theme.fg2,0x9f);
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

g.setPaletteColor(g.theme.fg2,0x9f); //swap cyan for pale blue
Bangle.loadWidgets(true);
g.clear();
startdraw();
setButtons();




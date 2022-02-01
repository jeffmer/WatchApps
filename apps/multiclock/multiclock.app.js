var FACES = [];
var STOR = require("Storage");
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var lastface = STOR.readJSON("multiclock.json") || {pinned:0}
var iface = lastface.pinned;
var face = FACES[iface]();
var intervalRefSec;
var intervalRefSec;
var tickTimeout;

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

var saved;

function hide_widgets(){
  saved = [];
  for (var wd of WIDGETS) {
    saved.push({d:wd.draw,a:wd.area});
    wd.draw=()=>{};
    wd.area="";
  }
}

function reveal_widgets(){
  for (var wd of WIDGETS) {
    var o = saved.shift();
    wd.draw = o.d;
    wd.area = o.a;
  }
  saved=null;
}


function startdraw(notfirst) {
  g.reset();
  selfmanage = face.init(notfirst);
  if (face.tickpersec)
    intervalRefSec = setInterval(face.tick,1000);
  else 
    queueMinuteTick();
  if(!selfmanage) {
    if (saved) reveal_widgets();
    Bangle.drawWidgets();
  } else {
    if (!saved) hide_widgets();
  }
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
  Bangle.setUI("clockleftright", newFace);
}

E.on('kill',()=>{
    if (iface!=lastface.pinned){
      lastface.pinned=iface;
      STOR.write("multiclock.json",lastface);
    }
});

Bangle.loadWidgets();
g.clear();
startdraw();
setButtons();




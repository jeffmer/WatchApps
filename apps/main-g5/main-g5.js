
const STOR = require("Storage");

global.wOS = {
    ON_TIME: 10,
    BRIGHT : 0.5,
    FACEUP:true,
    VIBRATE:true,
    awake : true,
    time_left:10,
    ticker:undefined,
    settings:undefined,
    buzz: (v)=>{
        if (!wOS.VIBRATE) return;
        v = v? v : 100;
        if (v<=50){
            digitalPulse(wOS.BUZZPIN,true,v);
        } else {
            wOS.BUZZPIN.set();
            setTimeout(()=>{wOS.BUZZPIN.reset();},v);
        }
    },
    batV: () => {
        return  6.614*analogRead(wOS.BATVOLT);
    },
    isCharging:()=>{return !wOS.BATPIN.read();},
    setLCDTimeout:(v)=>{wOS.ON_TIME=v<5?5:v;},
    brightness:(v)=>{var dv = Math.floor(255*v); g.brightness(dv);},
    setLCDBrightness:(v)=>{wOS.BRIGHT=v; wOS.brightness(v);},
    init:()=>{
        var s = STOR.readJSON("settings.json",1)||{ontime:10, bright:0.5, timezone:1,faceup:true,vibrate:true,steps:false,lowbright:0.3,nightbright:0.1,daystart:7,lowstart:19,nightstart:23};
        wOS.ON_TIME=s.ontime;
        wOS.time_left=s.ontime;
        wOS.BRIGHT=s.bright;
        wOS.FACEUP=s.faceup;
        wOS.VIBRATE=(typeof s.vibrate!='undefined')?s.vibrate:true;
        wOS.STEPS=(typeof s.steps!='undefined')?s.steps:false;
        wOS.settings=s;
        E.setTimeZone(s.timezone);
    },
    sleep:() => {
        wOS.awake = false;
        wOS.brightness(0);
        TC.stop();
        wOS.emit("lcdPower",false);
        g.flip(); //make sure finished with SPI before stopping it.
        g.lcd_sleep();
       // setTimeout(anom89,100);
    },
    bright:()=>{
        var hrs = Date().getHours();
        var ds = wOS.settings.daystart;
        var ls = wOS.settings.lowstart;
        var ns = wOS.settings.nightstart;
        var b = (hrs>=ds && hrs<ls)? wOS.BRIGHT : (hrs>=ls && hrs<ns) ? wOS.settings.lowbright : wOS.settings.nightbright;
        wOS.brightness(b);
    },
    wake:()=> {
        wOS.awake = true;
        wOS.time_left = wOS.ON_TIME;
        TC.start();
        g.lcd_wake();
        wOS.emit("lcdPower",true);
        wOS.bright();
        wOS.ticker = setInterval(wOS.tick,1000);
        setTimeout(()=>{g.lowpower(0);},500);
        setTimeout(()=>{g.lowpower(1);},1000);
    },
    setLCDPower:(b)=>{
        if (b){
            if (wOS.awake) wOS.time_left = wOS.ON_TIME; else wOS.wake();
        } else 
            wOS.sleep();
    },
    isLCDOn:()=>{ return wOS.awake;},
    tick:()=>{
        wOS.time_left--;
        if (wOS.time_left<=0){
           if (wOS.ticker) wOS.ticker=clearInterval(wOS.ticker);
           wOS.emit("sleep",true);
           wOS.sleep();
        }
    }
};

var wOSI2C = new I2C();

wOSI2C.setup({scl:D10,sda:D9,bitrate:200000});
wOS.BATPIN = D13;
wOS.BATVOLT = D4;
wOS.BUZZPIN = D39;

global.Bangle = wOS;

function watchBat(){
    setWatch(()=>{
      if(!wOS.awake) wOS.wake();
      wOS.emit("charging",wOS.isCharging());
  },wOS.BATPIN,{edge:"both",repeat:true,debounce:500});
}

wOS.init();
eval(STOR.read("lcd-g5buff.js"));
var g = AMOLED();
g.setTheme((wOS.settings.theme)? wOS.settings.theme : {fg:15,bg:0,fg2:8,bg2:0,fgH:15,bgH:9,dark:true});
//console.log("loaded lcd");
eval(STOR.read("cst816s-g5.js"));
//console.log("loaded touch");
eval(STOR.read("accel-g5.js"));
ACCEL.init();
ACCEL.on("faceup",()=>{if (!wOS.awake) wOS.wake();});
//console.log("loaded accel");
wOS.POWER=wOS.isCharging();
watchBat();
wOS.wake();

if (STOR.read("alarm.boot.js")) eval(STOR.read("alarm.boot.js"));

E.getBattery = function (){
    var v = wOS.batV();
    v = v<3.7?3.7:v;
    return Math.floor((v-3.7)*200);
}

wOS.showLauncher = function(){load("launch-g5.js");};
eval(STOR.read("menu-g5.js"));
eval(STOR.read("prompt-g5.js"));
eval(STOR.read("widgets-g5.js"));
if (wOS.settings.gpsclient) 
    eval(STOR.read("gps.js"));
else {
    Bangle.setGPSPower = function(on){};
}

wOS.btnWatches = [
    setWatch(function() {if (wOS.awake) wOS.showLauncher(); else wOS.wake();}, BTN1, {repeat:1,edge:"falling"}),
  ];

setWatch(function() {if (!wOS.awake) wOS.wake();}, BTN2, {repeat:1,edge:"falling"});
E.on("kill",()=>{if (wOS.awake) wOS.sleep();});



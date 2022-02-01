
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
    buzz: function(v){
        return new Promise(function(resolve, reject) {
            v = v? v : 100;
            if (!wOS.VIBRATE) resolve();
            else if (v<=50){
                digitalPulse(wOS.BUZZPIN,false,v);
                resolve();
            } else {
                wOS.BUZZPIN.reset();
                setTimeout(()=>{wOS.BUZZPIN.set();resolve();},v);
            }
        });
    },
    batV: () => {
        return  7.0*analogRead(wOS.BATVOLT);
    },
    isCharging:()=>{return !wOS.BATPIN.read();},
    setLCDTimeout:(v)=>{wOS.ON_TIME=v<5?5:v;},
    setLCDBrightness:(v)=>{wOS.BRIGHT=v; wOS.brightness(v);},
    init:()=>{
            var s = STOR.readJSON("settings.json",1)||{ontime:10, bright:0.5, timezone:1,faceup:true,vibrate:true,steps:false};
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
if (process.env.BOARD=="P8") {
    wOSI2C.setup({scl:D7,sda:D6,bitrate:200000});
    wOS.BATPIN = D19;
    wOS.BATVOLT = D31;
    wOS.BUZZPIN = D16;
} else {
    wOSI2C.setup({scl:D14,sda:D15,bitrate:200000});
    wOS.BATPIN = D8;
    wOS.BATVOLT = D30;
    wOS.BUZZPIN = D6;
}  

global.Bangle = wOS;

function watchBat(){
    setWatch(()=>{
      if(!wOS.awake) wOS.wake();
      wOS.emit("charging",wOS.isCharging());
  },wOS.BATPIN,{edge:"both",repeat:true,debounce:500});
}
wOS.init();
eval(STOR.read(process.env.BOARD=="P8"?"lcd-p8.js":"lcd.js"));
var g = ST7789();
g.theme= (wOS.settings.theme)? wOS.settings.theme : {fg:0xffff,bg:0,fg2:0x07ff,bg2:0,fgH:0xFFFF,bgH:0x001F,dark:true};
wOS.bright();
//console.log("loaded lcd");
if (process.env.BOARD=="ROCK")
    eval(STOR.read("cst816s.js"));
else if (process.env.BOARD=="P8")
    eval(STOR.read("cst716-p8.js"));
else   
    eval(STOR.read("cst716.js"));
TC.start();
//console.log("loaded touch");   
if (wOS.STEPS)
    eval(STOR.read("accel_step.js"));
else
    eval(STOR.read("accel.js"));
ACCEL.init();
ACCEL.on("faceup",()=>{if (!wOS.awake) wOS.wake();});
//console.log("loaded accel");
wOS.ticker = setInterval(wOS.tick,1000);

wOS.POWER=wOS.isCharging();
watchBat();

if (STOR.read("alarm.boot.js")) eval(STOR.read("alarm.boot.js"));

setWatch(() =>{
    if(wOS.awake) {
        wOS.time_left=wOS.ON_TIME;
    } else
        wOS.wake();
    wOS.longBTN1TO=setTimeout(wOS.showLauncher,1500);
  },BTN1,{repeat:true,edge:"rising"});

setWatch(function() { 
    if (wOS.longBTN1TO) wOS.longBTN1TO = clearTimeout(wOS.longBTN1TO);
}, BTN1, {repeat:1,edge:"falling"})

if (typeof BTN2!='undefined')
setWatch(() =>{
    if(wOS.awake) {
        wOS.time_left=wOS.ON_TIME;
        if (!wOS.btnWatches) setTimeout(reset, 500);
      } else
          wOS.wake();
},BTN2,{repeat:true,edge:"falling"});


E.getBattery = function (){
    var v = wOS.batV();
    v = v<3.7?3.7:v;
    return Math.floor((v-3.7)*200);
}

wOS.showLauncher = function(){load("launch.js");};
eval(STOR.read("menu.js"));
eval(STOR.read("prompt.js"));
eval(STOR.read("widgets.js"));
if (wOS.settings.gpsclient) 
    eval(STOR.read("gps.js"));
else {
    Bangle.setGPSPower = function(on){};
}

if (STOR.read("android.boot.js")) {
    eval(STOR.read("android.boot.js"));
    Bangle.appRect = { x: 0, y: 24, w: 240, h: 216, x2: 239, y2: 239 };
    TC.on("touch",function(p){
        Bangle.emit("touch",p.y<24?1:2,p);
    });
    var temp = process.env;
    temp.HWVERSION=2;
    process.env=temp;
}



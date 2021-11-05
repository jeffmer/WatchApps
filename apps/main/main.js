
const STOR = require("Storage");

var wOSI2C = new I2C();
wOSI2C.setup({scl:D14,sda:D15,bitrate:200000});

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
            digitalPulse(D6,false,v);
        } else {
            D6.reset();
            setTimeout(()=>{D6.set();},v);
        }
    },
    batV: () => {
        return  7.0*analogRead(D30);
    },
    isCharging:()=>{return !D8.read();},
    setLCDTimeout:(v)=>{wOS.ON_TIME=v<5?5:v;},
    brightness:(v)=>{
        v = v>1?1:v<0?0:v;
        if (v==0||v==1)
            digitalWrite(D12,v);
          else
            analogWrite(D12,v,{freq:60});
    },
    setLCDBrightness:(v)=>{wOS.BRIGHT=v; wOS.brightness(v);},
    init:()=>{
            var s = STOR.readJSON("settings.json",1)||{ontime:10, bright:0.5, timezone:1,faceup:true,vibrate:true};
            wOS.ON_TIME=s.ontime;
            wOS.time_left=s.ontime;
            wOS.BRIGHT=s.bright;
            wOS.FACEUP=s.faceup;
            wOS.VIBRATE=(typeof s.vibrate!='undefined')?s.vibrate:true;
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
    wake:()=> {
        wOS.awake = true;
        wOS.time_left = wOS.ON_TIME;
        TC.start();
        g.lcd_wake();
        wOS.emit("lcdPower",true);
        wOS.brightness(wOS.BRIGHT);
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

global.Bangle = wOS;

function watchBat(){
    setWatch(()=>{
      if(!wOS.awake) wOS.wake();
      wOS.emit("charging",wOS.isCharging());
  },D8,{edge:"both",repeat:true,debounce:500});
}

wOS.init();
eval(STOR.read("lcd.js"));
var g = ST7789();
g.theme= (wOS.settings.theme)? wOS.settings.theme : {fg:0xffff,bg:0,fg2:0x07ff,bg2:0,fgH:0xFFFF,bgH:0x001F,dark:true};
wOS.brightness(wOS.BRIGHT);
//console.log("loaded lcd");
if (process.env.BOARD=="ROCK")
    eval(STOR.read("cst816s.js"));
else    
    eval(STOR.read("cst716.js"));
TC.start();
//console.log("loaded touch");
if (wOS.FACEUP && STOR.read("accel.js")){ 
    eval(STOR.read("accel.js"));
    ACCEL.init();
    ACCEL.on("faceup",()=>{if (!wOS.awake) wOS.wake();});
    //console.log("loaded accel");
}
wOS.ticker = setInterval(wOS.tick,1000);

wOS.POWER=wOS.isCharging();
watchBat();

if (STOR.read("alarm.boot.js")) eval(STOR.read("alarm.boot.js"));

wOS.btnWatches = [
    setWatch(function() { 
            if (wOS.awake) wOS.showLauncher();
    }, BTN1, {repeat:1})
];

setWatch(() =>{
    if(wOS.awake) {
        wOS.time_left=wOS.ON_TIME;
    } else
        wOS.wake();
  },BTN1,{repeat:true,edge:"falling"});

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



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
    isPower:()=>{return !D8.read();},
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
            E.setTimeZone(s.timezone);
    },
    sleep:() => {
        wOS.awake = false;
        wOS.brightness(0);
        TC.stop();
        wOS.emit("sleep",true);
        g.flip(); //make sure finished with SPI before stopping it.
        g.lcd_sleep();
       // setTimeout(anom89,100);
    },
    wake:()=> {
        wOS.awake = true;
        wOS.time_left = wOS.ON_TIME;
        TC.start();
        g.lcd_wake();
        wOS.emit("sleep",false);
        wOS.brightness(wOS.BRIGHT);
        wOS.ticker = setInterval(wOS.tick,1000);
    },
    setLCDPower:(b)=>{
        if (b){
            if (wOS.awake) wOS.time_left = wOS.ON_TIME; else wOS.wake();
        } else 
            wOS.sleep();
    },
    tick:()=>{
        wOS.time_left--;
        if (wOS.time_left<=0){
           if (wOS.ticker) wOS.ticker=clearInterval(wOS.ticker);
           wOS.emit("sleep",true);
           wOS.sleep();
        }
    }
};

function watchBat(){
    setWatch(()=>{
      if(!wOS.awake) wOS.wake();
      wOS.emit("power",wOS.isPower());
  },D8,{edge:"both",repeat:true,debounce:500});
}

wOS.init();
eval(STOR.read("lcd.js"));
var g = ST7789();
g.theme={fg:0xffff,bg:0,fg2:0x07ff,bg2:0,fgH:0xFFFF,bgH:0x001F,dark:true};
wOS.brightness(wOS.BRIGHT);
//console.log("loaded lcd");
eval(STOR.read("touch.js"));
TC.start();
//console.log("loaded touch");
if (wOS.FACEUP && STOR.read("accel.js")){ 
    eval(STOR.read("accel.js"));
    ACCEL.init();
    ACCEL.on("faceup",()=>{if (!wOS.awake) wOS.wake();});
    //console.log("loaded accel");
}
wOS.ticker = setInterval(wOS.tick,1000);

wOS.POWER=wOS.isPower();
watchBat();

if (STOR.read("alarm.boot.js")) eval(STOR.read("alarm.boot.js"));

wOS.btnWatches = [
    setWatch(function() { 
            if (wOS.awake) load("clock.app.js");
    }, BTN1, {repeat:1})
];

setWatch(() =>{
    if(wOS.awake) {
        wOS.time_left=wOS.ON_TIME;
    } else
        wOS.wake();
  },BTN1,{repeat:true,edge:"falling"});

setWatch(() =>{
    if(wOS.awake) {
        wOS.time_left=wOS.ON_TIME;
        if (!wOS.btnWatches) setTimeout(reset, 500);
      } else
          wOS.wake();
},BTN2,{repeat:true,edge:"falling"});






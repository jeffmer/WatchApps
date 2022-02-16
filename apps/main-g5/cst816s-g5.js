// touch driver cst816s
const TOUCH_PIN = D29;
const RESET_PIN = D28;

pinMode(TOUCH_PIN,'input');

global.TC = {
    DOWN:1, UP:2, LEFT:3, RIGHT:4, CLICK:5, LONG:12,
    _wid:undefined,
    writeByte:(a,d) => { 
        wOSI2C.writeTo(0x15,a,d);
    }, 
    readBytes:(a,n) => {
        wOSI2C.writeTo(0x15, a);
        return wOSI2C.readFrom(0x15,n); 
    },
    getXY:()=>{
        var _data = TC.readBytes(0x00,8);
        return { x:Math.floor((((_data[3]&0x0F)<<8)|_data[4])/2),
                 y:Math.floor((((_data[5]&0x0F)<<8)|_data[6])/2),
                 gest:_data[1]
               };
    },
    enable:()=>{TC.writeByte(0xFA, 0x11);},  // set to gesture mode
    sleepMode:()=>{TC.writeByte(0xA5,0x03);},
    touchevent:() => {
        wOS.time_left = wOS.ON_TIME; //reset LCD on time.
        var p = TC.getXY();
        if (p.gest==TC.CLICK) TC.emit("touch",p);
        else if (p.gest>=1 && p.gest<=4) TC.emit("swipe",p.gest); 
        else if (p.gest==TC.LONG) TC.emit("longtouch",p); 
    },
    start:()=>{
        digitalPulse(RESET_PIN,0,5);
        var t = getTime()+50/1000; while(getTime()<t); // delay 150 ms
        TC.enable();
        if (TC._wid) clearWatch(TC._wid);
        TC._wid = setWatch(TC.touchevent,TOUCH_PIN,{repeat:true,edge:"falling"});
    },
    stop:()=>{
        if (TC._wid) {
            TC._wid = clearWatch(TC._wid);
            TC._wid = undefined;
        }
        TC.sleepMode();
    }
};

/*

TC.on("touch", (p)=>{
    console.log("touch x: "+p.x+" y:"+p.y);
});

TC.on("swipe", (d)=>{
    console.log("swipe d: "+d);
});

TC.on("longtouch", (p)=>{
    console.log("long touch");
});
*/







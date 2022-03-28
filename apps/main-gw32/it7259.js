// touch driver for it7529 on GW32
// //directions right=14, up =12, dowm = 8 , left=10

const TOUCH_PIN = D11;
const RESET_PIN = D23;
D12.set();   //power up TC
var TCI2C =  new I2C();
TCI2C.setup({scl:D41,sda:D40,bitrate:200000});

pinMode(TOUCH_PIN,'input');

global.TC = {
    DOWN:1, UP:2, LEFT:3, RIGHT:4, CLICK:5, LONG:12,
    _wid:undefined,
    writeByte:(a,d) => { 
        TCI2C.writeTo(0x46,a,d);
    }, 
    readBytes:(a,n) => {
        TCI2C.writeTo(0x46, a);
        return TCI2C.readFrom(0x46,n); 
    },
    getXY:()=>{
        var _data = TC.readBytes(0xE0,14);
        return { x:240-_data[2],
                 y:240-_data[4],
                 gest:_data[1],
                 dir:_data[10]    
               };
    },
    touchevent:() => {
        wOS.time_left = wOS.ON_TIME; //reset LCD on time.
        var p = TC.getXY();
        if (!p.gest) return;
        if (p.gest==32) {p.gest=TC.CLICK; TC.emit("touch",p);}
        else if (p.gest==33) {p.gest=TC.LONG; TC.emit("longtouch",p);}
        else if (p.gest==34 && p.dir !=0) TC.emit("swipe",p.dir<=10? p.dir-7 : p.dir-10);  
    },
    start:()=>{
        digitalPulse(RESET_PIN,0,5);
        var t = getTime()+50/1000; while(getTime()<t); // delay 150 ms
        TC.writeByte(0x20,[0x02,0x04,0x01,0x00]); //enable  interrupt 
        TC._wid = setWatch(TC.touchevent,TOUCH_PIN,{repeat:true,edge:"falling"});
    },
    stop:()=>{
        if (TC._wid) {
            TC._wid = clearWatch(TC._wid);
            TC._wid = undefined;
        }
        TC.writeByte(0x20,[0x04,0x00,0x01]); //idle mode
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

TC.start();

*/

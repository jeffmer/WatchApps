//sc7a20   - use datasheet for LIS3DH

var ACCELPIN = D19;
var ACCELI2C = new I2C();
ACCELI2C.setup({scl:D4,sda:D27,bitrate:200000});
/*
var support = E.compiledC(`
// int conv(int,int)
// int calib(int,int,int)

int  conv(int lo, int hi) {
  int i = (hi<<8)+lo;
  return ((i & 0x7FFF) - (i & 0x8000))/16;
}

int calib(int value, int offset, int scale) {
  return ((value - offset)*scale)/1000;
}

`);
*/

var support = (function(){
  var bin=atob("QBpQQ0/0enOQ+/PwcEcA6wEhwfMOAAH0AEFBGhAgkfvw8HBH");
  return {
    conv:E.nativeCall(15, "int(int,int)", bin),
    calib:E.nativeCall(1, "int(int,int,int)", bin),
  };
})();

var ACCEL = {
    writeByte:(a,d) => { 
      ACCELI2C.writeTo(0x19,a,d);
    }, 
    readBytes:(a,n) => {
      ACCELI2C.writeTo(0x19, a);
        return ACCELI2C.readFrom(0x19,n); 
    },
    activity:0,
    init:() => {
        var id = ACCEL.readBytes(0x0F,1)[0];
        ACCEL.writeByte(0x20,0x47);
        ACCEL.writeByte(0x21,0x00); //highpass filter disabled
        ACCEL.writeByte(0x22,0x40); //interrupt to INT1
        ACCEL.writeByte(0x23,0x88); //BDU,MSB at high addr, HR
        ACCEL.writeByte(0x24,0x00); //latched interrupt off
        ACCEL.writeByte(0x32,0x18); //threshold = 250 milli g's
        ACCEL.writeByte(0x33,0x01); //duration = 1 * 20ms
        ACCEL.writeByte(0x30,0x08); //YH interrupt  
        pinMode(ACCELPIN,"input",false);
        setWatch(()=>{
           var  v = ACCEL.read();
           if (ACCEL.activity<300) {
             ACCEL.activity=330; 
             if(!ACCEL.stinterval) ACCEL.stepStart();
           }
           if (Math.abs(v.x)<2000 && v.y>250 && v.z>0) {
            if (wOS.awake)
               wOS.time_left = wOS.ON_TIME; //reset LCD on time.
            else
               ACCEL.emit("faceup");
           }
        },ACCELPIN,{repeat:true,edge:"rising",debounce:50});
        return id;
    },
    read:()=>{
        var a = ACCEL.readBytes(0xA8,6);
        var f = support.conv;
        return {x:f(a[0],a[1]), y:f(a[2],a[3]), z:f(a[4],a[5])};
    },
    stepStart:()=>{
        ACCEL.stinterval = setInterval(()=>{
          var a = ACCEL.read();
          var sts = E.stepCount(a.x,a.y,a.z);
          //if(sts>0) console.log("steps "+sts,a);
          --ACCEL.activity;
          if (ACCEL.activity<=0) ACCEL.stinterval = clearInterval(ACCEL.stinterval);
        },80);
    }
  };
  
/*
  function ty(){
    var tt = Date.now();
    var a = ACCEL.read();
    console.log("Time: "+Math.ceil(Date.now()-tt)+"ms");
    return a;
  }
*/
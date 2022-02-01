//sc7a20   - use datasheet for LIS3DH

var ACCELPIN = D8;
var CALIBDATA = STOR.readJSON("accel.json",1)||{offset:{x:0,y:0,z:0},scale:{x:1000,y:1000,z:1000}};
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
      wOSI2C.writeTo(0x18,a,d);
    }, 
    readBytes:(a,n) => {
      wOSI2C.writeTo(0x18, a);
        return wOSI2C.readFrom(0x18,n); 
    },
    activity:0,
    init:() => {
        var id = ACCEL.readBytes(0x0F,1)[0];
        ACCEL.writeByte(0x20,0x47);
        ACCEL.writeByte(0x21,0x00); //highpass filter disabled
        ACCEL.writeByte(0x22,0x40); //interrupt to INT1
        ACCEL.writeByte(0x23,0x88); //BDU,MSB at high addr, HR
        ACCEL.writeByte(0x24,0x00); //latched interrupt off
        ACCEL.writeByte(0x32,0x10); //threshold = 250 milli g's
        ACCEL.writeByte(0x33,0x01); //duration = 1 * 20ms
        ACCEL.writeByte(0x30,0x02); //XH interrupt 
        pinMode(ACCELPIN,"input",false);
        setWatch(()=>{
           var  v = ACCEL.read0();
           if (ACCEL.activity<300) {
             ACCEL.activity=330; 
             if(!ACCEL.stinterval) ACCEL.stepStart();
           }
          if (v>192) ACCEL.emit("faceup");
        },ACCELPIN,{repeat:true,edge:"rising",debounce:50});
        return id;
    },
    read0:()=>{
        return ACCEL.readBytes(0x01,1)[0];
    },
    read:()=>{
        "ram"
        var a = ACCEL.readBytes(0xA8,6);
        var f = support.conv;
        return {x:f(a[0],a[1]), y:f(a[2],a[3]), z:f(a[4],a[5])};
    },
    calibRead:()=>{
        "ram"
        var O = CALIBDATA.offset; var S = CALIBDATA.scale;
        var m = ACCEL.read(); var f = support.calib;
        m.x = f(m.x,O.x,S.x); m.y=f(m.y,O.y,S.y); m.z=f(m.z,O.z,S.z);
        return m;
    },
    stepStart:()=>{
        ACCEL.stinterval = setInterval(()=>{
          var a = ACCEL.calibRead();
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
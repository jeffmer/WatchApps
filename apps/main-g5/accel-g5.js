//KXTJ3_1057
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
      wOSI2C.writeTo(0x0E,a,d);
    }, 
    readBytes:(a,n) => {
      wOSI2C.writeTo(0x0E, a);
        return wOSI2C.readFrom(0x0E,n); 
    },
    step:wOS.STEPS,
    delayms: function(d) {var t = getTime()+d/1000; while(getTime()<t);},
    init:() => {
        var id = ACCEL.readBytes(0x0F,1)[0];
        ACCEL.writeByte(0x1B,0x28);  //CNTL1 Off (top bit)
        ACCEL.writeByte(0x1D,0x28);  //CNTL2 Software reset
        ACCEL.delayms(2);
        ACCEL.writeByte(0x21,1); //DATA_CTRL_REG --25Hz
        ACCEL.writeByte(0x1D,0x28); 
        ACCEL.writeByte(0x1B,0xA8);  //CNTL1 Off (top bit), low power, DRDYE1, 2g , Wakeup=0
        setInterval(()=>{
          var a = ACCEL.read();
          if (ACCEL.step) E.stepCount(a.x,a.y,a.z);
           if ( (a.y>500 && a.y<1000 && a.z>-864 && a.z <226)) {
             if (wOS.awake)
               wOS.time_left = wOS.ON_TIME; //reset LCD on time.
             else
              ACCEL.emit("faceup");
           }
        },ACCEL.step?80:300);
        return id;
    },
    read:()=>{
        "ram"
        var a = ACCEL.readBytes(0x06,6);
        var f = support.conv;
        return {x:2*f(a[0],a[1]), y:2*f(a[2],a[3]), z:2*f(a[4],a[5])};
    },
  };
  
var ACCELPIN =D16;

function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}

var ACCEL = {
    writeByte:(a,d) => { 
      wOSI2C.writeTo(0x18,a,d);
    }, 
    readBytes:(a,n) => {
      wOSI2C.writeTo(0x18, a);
        return wOSI2C.readFrom(0x18,n); 
    },
    init:() => {
        ACCEL.writeByte(0x7E, 0xB6);
        delayms(10);
        ACCEL.writeByte(0x7D, 0x04);
        ACCEL.writeByte(0x41, 0x00); // 2g range
        ACCEL.writeByte(0x40, 0x17); 
        ACCEL.writeByte(0x7C, 0x03);
        setInterval(()=>{
          var a = ACCEL.read();
           if ( (a.x>500 && a.x<1000 && a.z>-864 && a.z <226)) {
             if (wOS.awake)
               wOS.time_left = wOS.ON_TIME; //reset LCD on time.
             else
              ACCEL.emit("faceup");
           }
        },200);
        return ACCEL.readBytes(0x0,1)[0];
    },
    read:()=>{
      function conv(lo,hi) { 
        var i = (hi<<8)+lo;
        return ((i & 0x7FFF) - (i & 0x8000))/16;
      }
      var a = ACCEL.readBytes(0x12,6);
      return {x:conv(a[0],a[1]), y:conv(a[2],a[3]), z:conv(a[4],a[5])};
  },
};
  
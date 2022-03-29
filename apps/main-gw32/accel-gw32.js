//sc7a20   - use datasheet for LIS3DH

var ACCELPIN = D19;
var ACCELI2C = new I2C();
ACCELI2C.setup({scl:D4,sda:D27,bitrate:200000});

var ACCEL = {
    writeByte:(a,d) => { 
      ACCELI2C.writeTo(0x19,a,d);
    }, 
    readBytes:(a,n) => {
      ACCELI2C.writeTo(0x19, a);
        return ACCELI2C.readFrom(0x19,n); 
    },
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
        function conv(lo,hi) { 
          var i = (hi<<8)+lo;
          return ((i & 0x7FFF) - (i & 0x8000))/16;
        }
        var a = ACCEL.readBytes(0xA8,6);
        return {x:conv(a[0],a[1]), y:conv(a[2],a[3]), z:conv(a[4],a[5])};
    },
  };
  
/*
  ACCEL.on("faceup",()=>console.log("faceup"));

  ACCEL.init();
  */
  

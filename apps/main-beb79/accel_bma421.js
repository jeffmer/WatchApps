
var ACCELPIN =D16;

function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}

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
    init:() => {
        ACCEL.writeByte(0x7C, 0x00);
        ACCEL.writeByte(0x7D, 0x04);
        ACCEL.writeByte(0x41, 0x00); // 2g range
        ACCEL.writeByte(0x40, 0x17); 
        ACCEL.writeByte(0x7C, 0x03);
        ACCEL.readBytes(0x1C,1); // clear any previous motion interrupt
        ACCEL.writeByte(0x56,0x20);  // map interrupt to INT 1
        ACCEL.writeByte(0x53,0x08); //enable INT 1 output
        setWatch(()=>{
          var a = ACCEL.read();
           if ( (a.x>500 && a.x<1000 && a.z>-864 && a.z <226)) {
             if (wOS.awake)
               wOS.time_left = wOS.ON_TIME; //reset LCD on time.
             else
              ACCEL.emit("faceup");
           }
           ACCEL.readBytes(0x1C,1); 
        },ACCELPIN, {repeat:1,edge:"falling"});
        return ACCEL.readBytes(0x0,1)[0];
    },
    read:()=>{
      "ram"
      var a = ACCEL.readBytes(0x12,6);
      var f = support.conv;
      return {x:f(a[0],a[1]), y:f(a[2],a[3]), z:f(a[4],a[5])};
  },
};

ACCEL.configRead= function(len,offset){
  ACCEL.writeByte(0x7C, 0x00); //disable sleep mode
  delayms(1);
  var res = [];
  for (var i = 0; i < len; i += 16) {
    ACCEL.writeByte(0x5B, (offset + (i/2)) & 0x0F);
    ACCEL.writeByte(0x5C, (offset + (i/2)) >> 4);
    res.push(ACCEL.readBytes(0x5E, (len-i >= 16) ? 16 : (len - i)));
  }
  ACCEL.writeByte(0x7C, 0x00); //enable sleep mode
  return res;
}

ACCEL.configWrite=function(data,offset){
  ACCEL.writeByte(0x7C, 0x00); //disable sleep mode
  delayms(1);
  for (var j =0; j<data.length;++j) {
    var i = j*16;
    ACCEL.writeByte(0x5B, (offset + (i/2)) & 0x0F);
    ACCEL.writeByte(0x5C, (offset + (i/2)) >> 4);
    ACCEL.writeByte(0x5E,data[j]);
  }
  ACCEL.writeByte(0x7C, 0x00); //enable sleep mode
}

ACCEL.motionInit = function(){
  var feature = ACCEL.configRead(0x46,256);
  feature[0][1] = 0x01;
  feature[0][3] =  feature[0][3] | 0x20; //x-axis
  ACCEL.configWrite(feature,256);
  ACCEL.readBytes(0x1C,1); // clear any previous motion interrupt
  ACCEL.writeByte(0x56,0x20);  // map interrupt to INT 1
  ACCEL.writeByte(0x53,0x08); //enable INT 1 output
}

E.stepInit = function(){
  var feature = ACCEL.configRead(0x46,256);
  feature[3][11] = 0x34; // 0x3A+1
  ACCEL.configWrite(feature,256);
}

E.totalSteps = function(){
  var res = ACCEL.readBytes(0x1E,4);
  return (res[3]<<24)+(res[2]<<16)+(res[1]<<8)+res[0];
}



  
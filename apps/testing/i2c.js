var wOSI2C = new I2C();

wOSI2C.setup({scl:D10,sda:D9,bitrate:200000});

function readByte(dev,a,d){ 
    wOSI2C.writeTo(dev,a,d);
  }

function readBytes(dev,a,n){
    wOSI2C.writeTo(dev, a);
      return wOSI2C.readFrom(dev,n); 
  }


function print(DEVICE){
  for (var i=0;i<255;i+=16)
  console.log(DEVICE," ",readBytes(DEVICE,i,16));
}


function search(){
    var device = 0;
    var interval = setInterval(()=>{
        console.log(device," ",readBytes(device,0,16));
        device+=2; if (device>=128) clearInterval(interval);
    },1000);
}



var PINS=[D2,D3,D5,D9,D10,D11,D12,D13,D14,D15,D16,D17,D18,D19,D20,D21,D22,D23,D25,D27,D28,D29,
    D31,D32,D33,D34,D35,D36,D37,D38,D39,D40,D42,D43,D44,D45,D46,D47];


var IC = new I2C();

var DEVICE = 0x18;

function ft(SDA,SCL,DEVICE){
    IC.setup({scl:SCL,sda:SDA,bitrate:200000});
    IC.writeTo(DEVICE,0);
    var A = IC.readFrom(DEVICE,16);
    for (var i=0;i<16;++i) 
       if (A[i]!=255) {
         console.log(SDA," ",SCL," ",A);
         return true;
       }
    return false;
}
    
function find_device(DEVICE){
for (var i = 0; i<PINS.length; ++i)
    for (var j = 0; j<PINS.length; ++j) {
        if (i!=j) {
            if (ft(PINS[i],PINS[j],DEVICE)) return;
        }
    }
}

var PINS=[D5,D9,D10,D11,D12,D13,D14,D15,D16,D18,D25,D27,D28,D29,
    D31,D32,D35,D37,D38,D39,D40,D42,D43,D46];

function find_backlight(){
    var i = 0;
    var interval = setInterval(()=>{
        console.log("pin ",PINS[i]);
        PINS[i].set();
        setTimeout(()=>{PINS[i].read();},2000);
        ++i; if (i>=48) clearInterval(interval);
    },4000);
}


/* Heart rate device test */
function writeByte(dev,a,d){ 
  wOSI2C.writeTo(dev,a,d);
}

function readBytes(dev,a,n){
  wOSI2C.writeTo(dev, a);
    return wOSI2C.readFrom(dev,n); 
}

//heartrate
function init(){
writeByte(0x38,1,0x13);
writeByte(0x38,4,4);
writeByte(0x38,5,0x0f);
writeByte(0x38,0x0e,100);
//writeByte(0x38,0x0f,0);
}

function hon(){
 writeByte(0x38,0,1);
 D36.reset();
}


function hoff(){
 D36.set();
 writeByte(0x38,0,0);
}

function readReg(a){
  wOSI2C.writeTo(0x38, a);
    return wOSI2C.readFrom(0x38,1)[0]; 
}


function hr(){
var a = (readReg(0x1d)<<8 + readReg(0x1c))&0xffff;
var b = readReg(0x1f)<<8 + readReg(0x1e)&0xffff;
console.log("A= ",a," B= ",b," A-B= ",a-b);
}
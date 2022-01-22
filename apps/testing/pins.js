var state = Int16Array(48);

function readAll(){
    for(i=0;i<48;++i) state[i] = digitalRead(i);
}

function compare(){
    for(i=0;i<48;++i) if (state[i] != digitalRead(i)) console.log("Pin ",i," ",digitalRead(i));
}

var PINS=[D2,D3,D5,D7,D8,D9,D10,D11,D12,D13,D16,D17,D18,D19,D20,D21,D22,D23,D25,D27,D28,D29,
  D31,D32,D35,D37,D38,D39,D40,D42,D43,D44,D45,D46,D47];

function all_set(){
  for(i=0;i<PINS.length;++i) PINS[i].set();
}

function all_reset(){
  for(i=0;i<PINS.length;++i) PINS[i].reset();
}

function all_read(){
  for(i=0;i<PINS.length;++i) 
     console.log(PINS[i]," ",PINS[i].read());
}

var wOSI2C = new I2C();

wOSI2C.setup({scl:D14,sda:D15,bitrate:200000});

function readByte(dev,a,d){ 
  wOSI2C.writeTo(dev,a,d);
}

function readBytes(dev,a,n){
  wOSI2C.writeTo(dev, a);
    return wOSI2C.readFrom(dev,n); 
}


function print(dev,i){
console.log(i," ",readBytes(dev,0,16));
}


function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}

function find_bl(){
  for(i=0;i<PINS.length;++i) {
    PINS[i].reset();
    console.log(PINS[i]);
    delayms(2000);
    PINS[i].read();
  }
}

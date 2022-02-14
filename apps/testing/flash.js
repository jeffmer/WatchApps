FCS.set(); // CS
var fc=new SPI(); // font chip - 2MB SPI flash
fc.setup({sck:FSCK,miso:FMISO,mosi:FMOSI,mode:0});
//fc.send([0xab,255,255,255],FCS);
//fc.send([0xab],FCS);
//fc.send([0x90,0,0,1,0,0],FCS); // id
//fc.send([0x9f,0,0,0],FCS); // id
fc.send([0xb9],FCS); //put to deep sleep


D17.set();
var fc=new SPI(); // font chip - 2MB SPI flash
fc.setup({sck:D19,miso:D21,mosi:D20,mode:0});
fc.send([0xab,255,255,255],D17);

//fc.send([0x90,0,0,1,0,0],FCS); // id


var PINS=[D5,D7,D8,D9,D10,D11,D12,D13,D16,D17,D18,D19,D20,D21,D22,D23,D25,D27,D28,D29,
  D31,D32,D35,D37,D38,D39,D40,D42,D43,D46];

// cs,clk,mosi,miso,io2/wp,io3/hold=20,25,22,23,21,24

function test_spi(){
  var FCS=D20;
  FCS.set();
  var fc=new SPI(); // font chip - 2MB SPI flash
  fc.setup({sck:D25,miso:D23,mosi:D22,mode:0});
  fc.send([0xab,255,255,255],FCS);
  fc.send([0xab],FCS);
  console.log(FCS," ",fc.send([0x90,0,0,1,0,0],FCS)); // id
  console.log(FCS," ",fc.send([0x9f,0,0,0],FCS)); // id
}

function test_all(){
  PINS.forEach(test_spi);
}

var PINS=[D5,D7,D8,D9,D10,D11,D12,D13,D16,D18,D22,D23,D25,D27,D28,D29,
  D31,D32,D35,D37,D38,D39,D40,D42,D43,D46];


function all_set(){
  for(i=0;i<PINS.length;++i) PINS[i].set();
}


function all_reset(){
  for(i=0;i<PINS.length;++i) PINS[i].reset();
}


//cs,clk,mosi,miso,io2/wp,io3/hold=20,25,22,23,21,24
var FCS = D17;
FCS.set();
var fc=new SPI(); // font chip - 2MB SPI flash
fc.setup({sck:D19,miso:D21,mosi:D20,mode:0});

function id(){
  fc.send([0xab,255,255,255],FCS);
  fc.send([0xab],FCS);
  console.log(FCS," ",fc.send([0x90,0,0,1,0,0],FCS)); // id
  console.log(FCS," ",fc.send([0x9f,0,0,0],FCS)); // id
}

//wp is D16

var FCS = D14;
FCS.set();

var fc=new SPI(); // font chip - 2MB SPI flash
fc.setup({sck:D19,miso:D15,mosi:D18,mode:0});
D17.set(); //hold
D16.set();  //wp

function id(){
  fc.send([0xff],FCS);
  fc.send([0xff],FCS);
  fc.send([0xab],FCS);
  fc.send([0xab,255,255,255],FCS);
  console.log(FCS," ",fc.send([0x90,0,0,1,0,0],FCS)); // id
  console.log(FCS," ",fc.send([0x9f,0,0,0],FCS)); // id
}
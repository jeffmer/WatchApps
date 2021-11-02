//driver for HRS3300
/*
var dcFilter = E.compiledC(`
// void init(int, int)
// int filter(int)
// int avgDC()

__attribute__((section(".text"))) int NSAMPLE = 24;
__attribute__((section(".text"))) int BIAS = 0;
__attribute__((section(".text"))) int sample_avg_total = 0;

void init(int v, int bias){
    NSAMPLE=v;
    BIAS=bias;
}

//remove dc from sample
int  filter(int sample) {
    sample_avg_total += (sample - sample_avg_total/NSAMPLE);
    return (sample - sample_avg_total/NSAMPLE)+BIAS;
}
// return average dc
int avgDC() {return sample_avg_total/NSAMPLE;}
       
`);
*/

var dcFilter = (function(){
  var bin=atob("AAAAABgAAAAAAAAAAkt7RAnLkPvz8HBH7v///wdJeUQwtZHoJACS+/X0BBujGAtgk/v188MaiGgYRDC93v///wJLe0RYYJlgcEcAv7r///8=");
  return {
    init:E.nativeCall(65, "void(int, int)", bin),
    filter:E.nativeCall(29, "int(int)", bin),
    avgDC:E.nativeCall(13, "int()", bin),
  };
})();
/*
var maFilter = E.compiledC(`
// void init(int)
// int filter(int)

__attribute__((section(".text"))) int NSLOT = 8;
__attribute__((section(".text"))) int nextslot = 0;
__attribute__((section(".text"))) int buffer[16];

void init(int n){
  NSLOT = n<=0?1:n>16?16:n;
}

int filter(int value) {
  buffer[nextslot] = value;
  nextslot = (nextslot+1) % NSLOT;
  int total = 0;
  for(int i=0; i<NSLOT; ++i) total += buffer[i];
  return total/NSLOT;
}        
`);
*/
var maFilter = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADkl5RBC1C2gNTAHrgwIBM1BgSmyT+/LwAvsQMwtgACMYRnxEk0IF2iEdUfgjEAEzCET355D78vAQvQC/sv///5L///8AKAPdECiovxAgAOABIAJLe0RYZHBHAL9g////");
  return {
    init:E.nativeCall(141, "void(int)", bin),
    filter:E.nativeCall(73, "int(int)", bin),
  };
})();
/*

var medianFilter = E.compiledC(`
// int filter(int)

__attribute__((section(".text"))) int NSLOT = 7;
__attribute__((section(".text"))) int nextslot = 0;
__attribute__((section(".text"))) int buffer[7];

int filter(int value) {
  int mbuf[7];
  buffer[nextslot] = value;
  nextslot = (nextslot+1) % NSLOT;
  for(int p=0; p<NSLOT; ++p)mbuf[p]=buffer[p];
  int minValue;
  for(int i=0;i<4;++i){
      minValue=mbuf[i];
      for (int j = i+1;j<7;++j){
          if (mbuf[j]<minValue){
              minValue=mbuf[j];
              mbuf[j] = mbuf[i];
              mbuf[i]=minValue;
          }
      }
  }
  return mbuf[2];
}        
`);
*/

var medianFilter = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAGEp6RDC1E2gXTALrgwEBM0hgEWqT+/HwAfsQMxNgibAAI3xEi0ID22tGBKwHrQfgIh1S+CMAAapC+CMAATPx51P4BA8aRlL4BB+BQr+/GGgQYBlgCEaqQvXRo0Lw0QOYCbAwvdb///+2////");
  return {
    filter:E.nativeCall(37, "int(int)", bin),
  };
})();

/*
var lpfFilter = E.compiledC(`
// int filter(int)

__attribute__((section(".text"))) float c[] = {0.1159525, 0.231905, 0.1159525,-0.7216814, 0.1854914};
__attribute__((section(".text"))) float v1 = 0.0;
__attribute__((section(".text"))) float v2 = 0.0;

int  filter(int sample) {
  float x = (float) sample;
  float v = x - (c[3] * v1) - (c[4] * v2);
  float y = (c[0] * v) + (c[1] * v1) + (c[2] * v2);
  v2 = v1;
  v1 = v;
  return (int)y;
}       
`);
*/

var lpfFilter = (function(){
  var bin=atob("AAAAAAAAAACBeO09gXhtPoF47T0dwDi/dfE9PhNLB+4QCntE0+0AatPtBVqT7QFq0+0GesPtAWq47sd6pe7metPtAlqn7sZ60+0DeoPtAHpm7qd65+4letPtBFrm7iV6/e7nehfukApwRwC/2v///w==");
  return {
    filter:E.nativeCall(29, "int(int)", bin),
  };
})();

/*
var hpfFilter = E.compiledC(`
// int filter(int)

__attribute__((section(".text"))) float c[] = {0.8703308, -1.7406616, 0.8703308, -1.723776, 0.7575469};
__attribute__((section(".text"))) float v1 = 0.0;
__attribute__((section(".text"))) float v2 = 0.0;

int  filter(int sample) {
  float x = (float) sample;
  float v = x - (c[3] * v1) - (c[4] * v2);
  float y = (c[0] * v) + (c[1] * v1) + (c[2] * v2);
  v2 = v1;
  v1 = v;
  return (int)y;
}       
`);
*/
var hpfFilter = (function(){
  var bin=atob("AAAAAAAAAAAAzl4/AM7evwDOXj+xpNy/mO5BPxNLB+4QCntE0+0AatPtBVqT7QFq0+0GesPtAWq47sd6pe7metPtAlqn7sZ60+0DeoPtAHpm7qd65+4letPtBFrm7iV6/e7nehfukApwRwC/2v///w==");
  return {
    filter:E.nativeCall(29, "int(int)", bin),
  };
})();

/*
var agcFilter = E.compiledC(`
// int filter(int)

__attribute__((section(".text"))) float  peak = 20;
__attribute__((section(".text"))) float  decay  = 0.971;
__attribute__((section(".text"))) float  boost  = 1.02987;
__attribute__((section(".text"))) float  threshold = 2;

  int filter(int spl){
      int abs_spl = spl>=0?spl:-spl;
      peak = (abs_spl > peak) ? peak * boost : peak * decay;
      if (spl > (peak * threshold) || spl < (peak * -threshold)) return 0;
      spl = 100 * spl / (2 * peak);
      return (int) spl;
  }    
`);
*/

var agcFilter = (function(){
  var bin=atob("AACgQcjSgz91k3g/AAAAQIDq4HIeS6Lr4HIH7hAqe0S47sd60+0AerTu53rx7hD6zL+T7QF6k+0CehZLZ+6HegfuEAp7RPjux2qT7QN6w+0Aeifuh2r07sZq8e4Q+hXcJ+5nevTux2rx7hD6DtRkI0NDB+4QOnfup3r47sdqhu6nev3ux3oX7pAKcEcAIHBH3v///7j///8=");
  return {
    filter:E.nativeCall(17, "int(int)", bin),
  };
})();

var HRS = {
  avgtotal:0,
  NSAMPLE:24, // Exponential Moving average DC removal alpha = 1/NSAMPLE
  NSLOT:4,
  next:0,
  buf:Int16Array(4),
  writeByte:(a,d) => { 
      I2C1.writeTo(0x44,a,d);
  }, 
  readByte:(a) => {
      I2C1.writeTo(0x44, a);
      return I2C1.readFrom(0x44,1)[0]; 
  },
  enable:() => {
    HRS.writeByte( 0x17, 0x10 );
    HRS.writeByte( 0x16, 0x78 );
    HRS.writeByte( 0x01, 0xe0 );	
    HRS.writeByte( 0x0c, 0x6e );
  },
  disable:() => {
    HRS.writeByte( 0x01, 0x08 );
    HRS.writeByte( 0x02, 0x80 );
    HRS.writeByte( 0x0c, 0x4e );
    
    HRS.writeByte( 0x16, 0x88 );
    
    HRS.writeByte( 0x0c, 0x22 );
    HRS.writeByte( 0x01, 0xf0 );
    HRS.writeByte( 0x0c, 0x02 );
  
    HRS.writeByte( 0x0c, 0x22 );
    HRS.writeByte( 0x01, 0xf0 );
    HRS.writeByte( 0x0c, 0x02 );
    
    HRS.writeByte( 0x0c, 0x22 );
    HRS.writeByte( 0x01, 0xf0 );
    HRS.writeByte( 0x0c, 0x02 );
    
    HRS.writeByte( 0x0c, 0x22 );
    HRS.writeByte( 0x01, 0xf0 );
    HRS.writeByte( 0x0c, 0x02 );
  },
  read:()=>{
      var m = HRS.readByte(0x09);
      var h = HRS.readByte(0x0A);
      var l = HRS.readByte(0x0F);
      return(m<<8)|((h&0x0F)<<4)|(l&0x0F); //16 bit
  },
};

P8.setLCDTimeout(600);
var x =0;
var lasty = 239;
var interval;

var stage0 = dcFilter.filter;
var stage1 = hpfFilter.filter;
var stage11 = medianFilter.filter;
var stage2 = agcFilter.filter;
var stage3 = maFilter.filter;
var stage4 = lpfFilter.filter;



function doread(){
  //var time= Date.now();
  var v =  HRS.read();
  v =  stage1(v);
  v =  stage11(v);
  v = stage2(v);
  v = stage4(v);
  //v = stage4(v);
  //v = stage4(v);
  v = 120+v;
  v = v>239?239:v<0?0:v;
  g.setColor(0);
  g.fillRect(x,0,x+1,239);
  g.setColor(0x07E0);
  g.fillRect(x,lasty,x+1,239-v);
  lasty=239-v;
  x+=2;
  if (x>=240) x = 0;
  //time = Math.floor(Date.now()-time);
  //console.log("Time: "+time+"ms");
}

function test(){
  g.clear();
  x=0;
  HRS.enable();
  dcFilter.init(24,0);
  maFilter.init(5);
  interval = setInterval(doread,40);
  setTimeout(()=>{
      if(interval) clearInterval(interval); 
      HRS.disable();
  },40000);
}
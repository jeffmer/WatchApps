 
/* Low pass, high pass and AGC filters adapted from Daniel Thompson's waspos heartrate module
*/

/*
var correlator = E.compiledC(`
// void put(int)
// int Cmax(void)
// int Cmin(void)
// int bpm(void)

__attribute__((section(".text"))) const int NSLOT = 128;
__attribute__((section(".text"))) char buffer[NSLOT];
__attribute__((section(".text"))) int next = 0;
__attribute__((section(".text"))) int correlationMin = 0;
__attribute__((section(".text"))) int correlationMax = 0;

void put(int v){
    buffer[next]=v;
    next = (next+1)%NSLOT;
}

int Cmax() {return correlationMax;}
int Cmin() {return correlationMin;}

int bpm() {
    const int CMIN = 7; // 60000/(200bpm * 40ms)
    const int CMAX = 37; //60000/(40bpm * 40ms)
    int minCorr = 0x7FFFFFFF;
    int maxCorr = 0;
    int minIdx = 0;
    for (int c=CMIN; c<CMAX;c++){
        int s = 0;
        int a = (next-c)>0? (next-c) : (NSLOT+next-c);
        int b = next;
        //correlate
        for (int i = 0;i<NSLOT-CMAX;i++){
            int d = buffer[b]-buffer[a];
            b = (b+1)%NSLOT;
            a = (a+1)%NSLOT;
            s+=d*d;
        }
        if (s<minCorr) {minCorr=s; minIdx=c;}
        if (s>maxCorr) maxCorr = s;
    }
    correlationMin = minCorr;
    correlationMax = maxCorr;
    return  minIdx==0?0:(60000/(minIdx*40));
}
`);
*/
var correlator = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt6fBHKk19RAAg1fgAgAcmqPEHAYZGb/AATAApC0ZCRti/AfGAA0/wWwkAJK8Yl/gEoO8YP3nH6woHAvEBChtKCuoCAgAqA/EBChhLuL8C8f8yCuoDA7y/YvB/AgEyACu+vwPx/zNj8H8DATO58QEJB/sHRNrRZEW8vzBGpEYBNqZFuL+mRiUuAfH/McXRCUt7RMP4hMDD+IjgKLEoI1hDTvZgI5P78PC96PCHfwAAgGr////g/v//Akt7RNP4hABwRwC/tv7//wJLe0TT+IgAcEcAv6b+//8JSXlEC2jKGBBxWhwFSxNAACu+vwPx/zNj8H8DATMLYHBHAL9/AACAlv7//w==");
  return {
    put:E.nativeCall(357, "void(int)", bin),
    Cmax:E.nativeCall(341, "int(void)", bin),
    Cmin:E.nativeCall(325, "int(void)", bin),
    bpm:E.nativeCall(141, "int(void)", bin),
  };
})();
/*
var avgMedFilter = E.compiledC(`
// int filter(int)

__attribute__((section(".text"))) const int NSLOT = 7;
__attribute__((section(".text"))) const int MID = 3;
__attribute__((section(".text"))) int nextslot = 0;
__attribute__((section(".text"))) int buffer[7];

int filter(int value) {
  int mbuf[NSLOT];
  buffer[nextslot] = value;
  nextslot = (nextslot+1) % NSLOT;
  for(int p=0; p<NSLOT; ++p)mbuf[p]=buffer[p];
  int minValue;
  for(int i=0;i<NSLOT;++i){
      minValue=mbuf[i];
      for (int j = i+1;j<NSLOT;++j){
          if (mbuf[j]<minValue){
              minValue=mbuf[j];
              mbuf[j] = mbuf[i];
              mbuf[i]=minValue;
          }
      }
  }
  return (mbuf[MID-1]+mbuf[MID]+mbuf[MID+1])/3;
}
`);
*/
var avgMedFilter = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcSnpEMLUTaALrgwEBM0hgByGT+/HxwevBAVsaibATYAGoACMRHVH4IxBA+CMQATMHK/fRaUYAIgEyUfgEXxNGBysL0Qcq99EEmwOYGEQFmwNEAyCT+/DwCbAwvVD4I0ClQsG/DWhA+CNQDGAlRgEz5ucAv9r///8=");
  return {
    filter:E.nativeCall(33, "int(int)", bin),
  };
})();

/*
var medianFilter = E.compiledC(`
// int filter(int)

__attribute__((section(".text"))) int NSLOT = 5;
__attribute__((section(".text"))) int MID = 2;
__attribute__((section(".text"))) int nextslot = 0;
__attribute__((section(".text"))) int buffer[7];

int filter(int value) {
  int mbuf[NSLOT];
  buffer[nextslot] = value;
  nextslot = (nextslot+1) % NSLOT;
  for(int p=0; p<NSLOT; ++p)mbuf[p]=buffer[p];
  int minValue;
  for(int i=0;i<=MID;++i){
      minValue=mbuf[i];
      for (int j = i+1;j<NSLOT;++j){
          if (mbuf[j]<minValue){
              minValue=mbuf[j];
              mbuf[j] = mbuf[i];
              mbuf[i]=minValue;
          }
      }
  }
  return mbuf[MID];
}
`);
*/

var medianFilter = (function(){
  var bin=atob("BQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFJeUT4tQtomgAKMiLwBwIAr63rAg1KaAHrggUBMqhgkvvz8AP7ECIYSEpgbEYAInhEmkIH2gDxCAFR+CIQRPgiEAEy9ecSSnpEACHS+CTAIh9hRRPcUvgEbwExFUYIRphC9tpV+ATvdkXEvxZoLmAA8QEAxL/C+ADgdkbw51T4LAC9Rvi9AL/S////pP///4z///8=");
  return {
    filter:E.nativeCall(41, "int(int)", bin),
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

/*
var pulseDetector = E.compiledC(`
// int isBeat(int)

__attribute__((section(".text"))) int cycle_max = 20;
__attribute__((section(".text"))) int cycle_min = -20;
__attribute__((section(".text"))) bool positive  = false;
__attribute__((section(".text"))) int  prev_sig = 0;

//  Returns true if a beat is detected
bool isBeat(int signal) {
  bool beat = false;
  //while positive slope record maximum
  if (positive && (signal > prev_sig)) cycle_max = signal;  
  //while negative slope record minimum
  if (!positive && (signal < prev_sig)) cycle_min = signal;
  //  positive to negative i.e peak so declare beat
  if (positive && (signal < prev_sig)) {
    int amplitude = cycle_max - cycle_min;
    if (amplitude > 20 && amplitude < 3000) {
      beat = true;
    }
    cycle_min = 0; positive = false;
  } 
  //negative to positive i.e valley bottom 
  if (!positive && (signal > prev_sig)) {
     cycle_max= 0; positive = true;
  } 
  prev_sig = signal; // save signal
  return beat;
}  
`);
*/

var pulseDetector = (function(){
  var bin=atob("AAAAAAAAAAAUAAAA7P///xZKekQTeOuxU2iDQgHakGAe4B3d0WiTaFsaFTtA9qIxi0JP8AABjL8AIwEj0WARcAtKekRRaIhCC90AIZFgASERcAbgU2iYQgDa0GAAI+/nACMESnpEUGAYRnBH6v///7r///+Y////");
  return {
    isBeat:E.nativeCall(17, "int(int)", bin),
  };
})();

var HRS = {
  writeByte:(a,d) => { 
    wOSI2C.writeTo(0x44,a,d);
  }, 
  readByte:(a) => {
    wOSI2C.writeTo(0x44, a);
    return wOSI2C.readFrom(0x44,1)[0]; 
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

Bangle.setLCDTimeout(300);
var x =20;
var lasty = 120;
var lastPeak =0;
var interval;
var bpminterval;

var f1 = hpfFilter.filter;
var f2 = medianFilter.filter;
var f3 = agcFilter.filter;
var f4 = lpfFilter.filter;
var bf = avgMedFilter.filter;
var det = pulseDetector.isBeat;
var put = correlator.put;

function doread(){
  var v =  f4(f3(f2(f1(HRS.read()))));
  v = 139-v;
  v = v>239?239:v<40?40:v;
  put(v);
  if (det(v)) {
    var peakTime = Date.now();
    var bpm = Math.floor(60000/(peakTime-lastPeak));
    if (bpm > 0 && bpm < 200) {
      bpm = bf(bpm);
      g.setColor(-1).setFontAlign(-1,-1).drawString(" BPM: "+bpm+" ",120,20,true);
    }
    lastPeak=peakTime;
  }
  g.setColor(0x001f).fillRect(x,70,x+1,169);
  var dv = v/2 + 50;
  g.setColor(0x07E0).fillRect(x,lasty,x+1,dv);
  lasty=dv;
  x+=2;
  if (x>=220) x = 20;
}

function showBPM(){
  var bpm = correlator.bpm();
  g.setColor(0xFFE0).setFontAlign(1,-1).drawString("BPM: "+bpm+" ",120,20,true);
}

function startMeasure() {
  if (interval) return;
  g.clear(1);
  g.setFont("Vector",16);
  x=20;
  g.setColor(0x001f).fillRect(20,70,219,169);
  HRS.enable();
  interval = setInterval(doread,40);
  bpminterval = setInterval(showBPM,2000);
}

function stopMeasure() {
  if(interval) {
    interval=clearInterval(interval); 
    if (bpminterval) bpminterval = clearInterval(bpminterval);
    HRS.disable();
    g.setColor(0xFD40).drawString("PAUSED",120,20,true);
  }
}

TC.on("swipe",(dir)=>{
  if (dir==TC.RIGHT) startMeasure();
  else if (dir==TC.LEFT) stopMeasure();
});

E.on("kill",()=>{stopMeasure();});

E.showMessage("Swipe right\n to start.\n Swipe left\n to stop.","Heart Rate");



/*
var correlator = E.compiledC(`
// void put(int)
// int conf(void)
// int bpm(void)

__attribute__((section(".text"))) const int NSLOT = 128;
__attribute__((section(".text"))) char buffer[NSLOT];
__attribute__((section(".text"))) int next = 0;
__attribute__((section(".text"))) int confidence = 0;

void put(int v){
    buffer[next]=v;
    next = (next+1)%NSLOT;
}

int conf() {return confidence;}

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
    confidence = 120 - (minCorr/600);
    confidence = confidence<0?0:confidence>100?100:confidence;
    return  minIdx==0?0:(60000/(minIdx*40));
}
`);
*/
var correlator = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3p8EMvTX1EBybV+ACAACCo8QcEb/AAQwAsIkZBRti/BPGAAk/wWwwAJwXrAQ6e+ASQBesCDp74BODO6wkOAfEBCR5JCeoBAQApAvEBCRtKuL8B8f8xCeoCAry/YfB/AQExACq+vwLx/zJi8H8CATK88QEMDvsOd9fRn0K4vzBGBvEBBri/O0YlLgTx/zTD0QtKk/vy8wxKeDNkK6i/ZCN6RCPq43PC+IQwKLEoI1hDTvZgI5P78PC96PCDfwAAgKj9//9u////1P7//wJLe0TT+IQAcEcAv6b+//8JSXlEC2jKGBBxWhwFSxNAACu+vwPx/zNj8H8DATMLYHBHAL9/AACAlv7//w==");
  return {
    put:E.nativeCall(357, "void(int)", bin),
    conf:E.nativeCall(341, "int(void)", bin),
    bpm:E.nativeCall(137, "int(void)", bin),
  };
})();
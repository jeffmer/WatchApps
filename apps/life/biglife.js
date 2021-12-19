/*
var board = E.compiledC(`
// void init(void)
// int alive(int,int)
// int getcell(int,int)
// void setcell(int,int)
// int readcell(int,int)
// void clearcell(int,int)
// void nextgen(void)

__attribute__((section(".text"))) unsigned int genA[32];
__attribute__((section(".text"))) unsigned int genB[32];
__attribute__((section(".text"))) unsigned int *cur = &genA[0];
__attribute__((section(".text"))) unsigned int *fut = &genB[0];

void init(){
   cur = &genA[0];
   fut = &genB[0];
}

int getcell(int x, int y) {
  if (x<0 || x>31 || y<0 || y>31) return 0;
  unsigned int cell = cur[y];
  return  (cell & 1<<x) ? 1 : 0;
}

int readcell(int x, int y) {
  unsigned int cell = fut[y];
  return  (cell & 1<<x) ? 1 : 0;
}

void setcell(int x, int y) {
  fut[y] = fut[y] | 1<<x;
}

void clearcell(int x, int y) {
  fut[y] = fut[y] & ~(1<<x);
}

int alive(int x ,int y) {
    int nc = getcell(x-1,y-1) + getcell(x,y-1) + getcell(x+1,y-1)
            + getcell(x-1,y) + getcell(x+1,y)
            + getcell(x-1,y+1) + getcell(x,y+1) + getcell(x+1,y+1);
    return (getcell(x,y) && nc==2 || nc==3)?1:0;
}

void nextgen() {
  unsigned int *tmp = cur;
  cur = fut; fut = tmp;
  for (int y=0; y<=31; y++)
  for (int x=0; x<=31; x++)
    if (alive(x,y)) setcell(x,y); else clearcell(x,y);
}

`);
*/

var board = (function(){
  var bin=atob("pAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkt7RBpoASMD+gDwUvghMCPqAANC+CEwcEcAv/L+//8FS3tEGmgBIwP6APBS+CEwGENC+CEAcEfS/v//Bkt7RBpoASMD+gDwUvghMBhCFL8BIAAgcEcAv7b+//8fKA7YHykM2AdLe0RaaAEjA/oA8FL4ITAYQhS/ASAAIHBHACBwRwC/jv7//y3p+EMB8f84APH/OQVGDkZIRkFG//fe/0FGBEYoRv/32f9vHEFGBEQ4Rv/30/8xRgRESEb/987/MUYERDhG//fJ/wbxAQgEREFGSEb/98L/QUYERChG//e9/0FGBEQ4Rv/3uP8xRgREKEb/97P/CLECLATQ4x5YQlhBvej4gwEgvej4gzi1Dkt7RJPoBgAAJFlgGmAAJSFGKEb/97H/IUYYsShG//d4/wLgKEb/92T/ATUgLe/RATQgLOvROL0Av+T9//8ES3tEA/EIAlpgA/GIAhpgcEcAv6b9//8=");
  return {
    init:E.nativeCall(597, "void(void)", bin),
    alive:E.nativeCall(401, "int(int,int)", bin),
    getcell:E.nativeCall(357, "int(int,int)", bin),
    setcell:E.nativeCall(297, "void(int,int)", bin),
    readcell:E.nativeCall(325, "int(int,int)", bin),
    clearcell:E.nativeCall(265, "void(int,int)", bin),
    nextgen:E.nativeCall(533, "void(void)", bin),
  };
})();

Bangle.setLCDTimeout(30);
var buf = Graphics.createArrayBuffer(160,160,1,{msb:true});

function flip(c) {
 g.setColor(c);
 g.drawImage({width:160,height:160,bpp:1,buffer:buf.buffer},40,40);
 buf.clear();
}

function initBoard(){
    board.init();
    for (let y = 0; y<31; ++y)
    for (let x = 0; x<31; ++x) {
        var r = Math.random()<0.5?1:0;
        if (r==1){
          board.setcell(x,y);
        } else {
          board.clearcell(x,y);
        }
    } 
    flip(g.theme.fg2);
}

function drawBoard(){
  for (let y = 0; y<31; ++y)
  for (let x = 0; x<31; ++x) {
      if (board.readcell(x,y)){
          var Xr=5*x;
          var Yr=5*y;
          buf.fillRect(Xr,Yr, Xr+3,Yr+3);
      } 
  } 
  flip(g.theme.fg2);
}

function howint(){
  g.setFont("6x8",2);
  g.setFontAlign(-1,-1,0);
  g.setColor(g.theme.fg);
  g.drawString('Gen:'+generation,20,220,true);
  ++generation;
}

function next(){
  board.nextgen();
  drawBoard();
  howint();
}

var intervalRef = null;
var generation=0;

function stopdraw() {
    if(intervalRef) {clearInterval(intervalRef);}
  }
  
function startdraw() {
    intervalRef = setInterval(next,1000);
}
    
  Bangle.on("lcdPower",(b)=>{if (!b) stopdraw(); else startdraw();});
  
  function restart(){
    stopdraw();
    g.clear();
    generation=0;
    howint();
    initBoard();
    drawBoard();
    startdraw();
  }

  g.clear();
  wOS.setUI("touch",restart);
  buf.setFont('Vector',40);
  buf.setFontAlign(0,0);
  buf.drawString('LIFE',80,80);
  buf.setFont('6x8',2);
  buf.drawString("Conway's",80,20);
  buf.drawString('(Touch Start)',80,140);
  flip(g.theme.fg);
 
  
    
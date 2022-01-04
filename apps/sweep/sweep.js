const p = Math.PI/2;
const PRad = Math.PI/180;

var cx = 100;
var cy = 100;

var pal2 = new Uint16Array([0x0000,0xffff,0xF100,0xC618],0,2);
var b = Graphics.createArrayBuffer(200,200,2,{msb:true});
function flip() {
    g.drawImage({width:200,height:200,bpp:2,buffer:b.buffer, palette:pal2},20,24);
}


function drawRotRect(w, r1,r2, angle) {
    var a = angle*PRad;
    let fn = Math.ceil;
    var sina = Math.sin(a);
    var cosa = Math.cos(a);
    var x0 = -w/2;
    var x1 = +w/2; 
    var y0 = r1;
    var y1 = r2;
    b.fillPoly([
      fn(cx - x0*cosa + y0*sina), fn(cy - x0*sina - y0*cosa),
      fn(cx - x1*cosa + y0*sina), fn(cy - x1*sina - y0*cosa),
      fn(cx - x1*cosa + y1*sina), fn(cy - x1*sina - y1*cosa),
      fn(cx - x0*cosa + y1*sina), fn(cy - x0*sina - y1*cosa)
    ]);
  }

  function bezel(r){
    b.setColor(1);
    b.setFont("Vector",16);
    b.setFontAlign(0,0);
    for (var i = 1; i<=12; ++i){
        var a = i*PRad;
        let x = cx+Math.sin(a*30)*r;
        let y = cy-Math.cos(a*30)*r;
        if (i==12 || i==11 || i==1) y+=3;
        b.drawString(i,x,y);
    }
  }


var minuteDate;
var secondDate;
var sixths = 0;

function onSecond(notfirst) {
    let hh = drawRotRect.bind(null,6,6,40);
    let mh = drawRotRect.bind(null,3,6,70);
    let sh = drawRotRect.bind(null,2,3,70);
    b.setColor(0);
    sh(6*secondDate.getSeconds()+sixths);
    if ((secondDate.getSeconds() === 0 && sixths===0)|| notfirst) {
        hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
        mh(360*minuteDate.getMinutes()/60);
        minuteDate = new Date();
    }
    b.setColor(1);
    hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
    mh(360*minuteDate.getMinutes()/60);
    b.setColor(1);
    b.fillCircle(cx, cy, 6);
    b.setColor(2);
    ++sixths; if (sixths>=6) {sixths=0; secondDate = new Date();}
    sh(6*secondDate.getSeconds()+sixths);
    b.fillCircle(cx, cy, 3);
    flip();
}

function drawAll(notfirst) {
    if (!notfirst) secondDate = minuteDate = new Date();
    // draw seconds
    b.setColor(1,1,1);
    //draw bezel
    if (!notfirst) bezel(88);
    var hrs = minuteDate.getHours();
    hrs = hrs>12?hrs-12:hrs;
    onSecond(notfirst);
    return true;
}

Bangle.setLCDPower(1);
Bangle.setLCDPower(1);
Bangle.setLCDTimeout(120);
drawAll();
setInterval(onSecond,166);
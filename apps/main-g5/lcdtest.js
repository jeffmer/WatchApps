var spi = new SPI();
spi.setup({sck:D5, mosi:D11,mode:0}); //spi.send([0xab],D5); 
const LCD_WIDTH = 226;
const LCD_HEIGHT = 226;
function init(spi, dc, ce, rst, callback) {
  function cmd(c, d) {
      dc.reset();
      spi.write(c, ce);
      if (d !== undefined) {
          dc.set();
          spi.write(d, ce);
      }
  }
  function dispinit(rst) {
    function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}
    D3.set(); //display enable
    delayms(10);
    rst.set();
    delayms(20);
    rst.reset();
    delayms(100);
    rst.set();
    delayms(100);
    cmd(0xFE,1);
    cmd(0x6C,0x0A);
    cmd(0x04,0xA0);
    cmd(0xFE,0x05);
    cmd(0x05,0x01);
    cmd(0xFE,0x00);
    //cmd(0x35,0x00);//tearing line?
    cmd(0x34); //tearing line off
    cmd(0x36,0xC0);
    cmd(0x3A,0x05);
    delayms(10);
    cmd(0x53,0x20);
    cmd(0xC4,0x80);
    cmd(0x11);
    delayms(120);
    cmd(0x29);
    cmd(0x51,0xFF); //Brightness 0x90 0xC0 0xFF
    D34.reset();
    //if (fn) fn();
}
  dispinit(rst);
}
let connect = function (spi, dc, ce, rst, callback) {
    var g = Graphics.createCallback(LCD_WIDTH, LCD_HEIGHT, 16, {
        setPixel: function (x, y, c) {
            x = 2*x; y =2*y;
            ce.reset();
            spi.write(0x2A, dc);
            spi.write(x >> 8, x, (x+1) >> 8, x+1);
            spi.write(0x2B, dc);
            spi.write((y) >> 8,  y, (y+1) >> 8, y+1);
            spi.write(0x2C, dc);
            spi.write(c >> 8, c);spi.write(c >> 8, c);spi.write(c >> 8, c);spi.write(c >> 8, c);
            ce.set();
        },
        fillRect: function (x1, y1, x2, y2, c) {
            x1 = 2*x1; 
            y1 = 2*y1; 
            x2 = 2*x2;
            y2 = 2*y2;
            ce.reset();
            spi.write(0x2A, dc);
            spi.write(x1>>8, x1, (x2+1)>>8, x2+1);
            spi.write(0x2B, dc);
            spi.write(y1>>8, y1, (y2+1)>>8, y2+1);
            spi.write(0x2C, dc);
            console.log("xlen ",x2-x1+2,"ylen ",y2-y1+2);
            spi.write({ data: String.fromCharCode(c >> 8, c), count: (x2 - x1 + 2) * (y2 - y1 + 2)});
            ce.set();
        }
    });
    init(spi, dc, ce, rst, callback);
    return g;
};
var g = connect(spi, D27, D26, D40, function() {});

g.setColor(1,0,0).setPixel(50,50);
g.setColor(9,1,1);
g.setFont("Vector",24).drawString("Espruino",50,50);

var spi = new SPI();
spi.setup({sck:D45, mosi:D44,mode:0}); //spi.send([0xab],D5); 
const LCD_WIDTH = 240;
const LCD_HEIGHT = 240;
const COLSTART = 0;
const ROWSTART = 0;
function init(spi, dc, ce, rst, callback) {
  function cmd(c, d) {
      dc.reset();
      spi.write(c, ce);
      if (d !== undefined) {
          dc.set();
          spi.write(d, ce);
      }
  }
  if (rst) {
      digitalPulse(rst, 0, 10);
  } else {
      cmd(0x01); //Software reset
  }
  
  /* SN80 specific */
  const ST7789_INIT_CODE = [
  [0xFE],
  [0xEF],
  [0xEB,0x14],
  [0x84,0x40],
  [0x85,0xF1],
  [0x86,0x98],
  [0x87,0x28],
  [0x88,0xA],
  [0x8A,0],
  [0x8B,0x80],
  [0x8C,1],
  [0x8D,0],
  [0x8E,0xDF],
  [0x8F,82],
  [0xB6,0x20],
  [0x36,0x48],
  [0x3A,5],
  [0x90,[8,8,8,8]],
  [0xBD,6],
  [0xA6,0x74],
  [0xBF,0x1C],
  [0xA7,0x45],
  [0xA9,0xBB],
  [0xB8,0x63],
  [0xBC,0],
  [0xFF,[0x60,1,4]],
  [0xC3,0x17],
  [0xC4,0x17],
  [0xC9,0x25],
  [0xBE,0x11],
  [0xE1,[0x10,0xE]],
  [0xDF,[0x21,0x10,2]],
  [0xF0,[0x45,9,8,8,0x26,0x2A]],
  [0xF1,[0x43,0x70,0x72,0x36,0x37,0x6F]],
  [0xF2,[0x45,9,8,8,0x26,0x2A]],
  [0xF3,[0x43,0x70,0x72,0x36,0x37,0x6F]],
  [0xED,[0x1B,0xB]],
  [0xAC,0x47],
  [0xAE,0x77],
  [0xCB,2],
  [0xCD,0x63],
  [0x70,[7,9,4,0xE,0xF,9,7,8,3]],
  [0xE8,0x34],
  [0x62,[0x18,0xD,0x71,0xED,0x70,0x70,0x18,0x0F,0x71,0xEF,0x70,0x70]],
  [0x63,[0x18,0x11,0x71,0xF1,0x70,0x70,0x18,0x13,0x71,0xF3,0x70,0x70]],
  [0x64,[0x28,0x29,1,0xF1,0,7,0xF1]],
  [0x66,[0x3C,0,0xCD,0x67,0x45,0x45,0x10,0,0,0]],
  [0x67,[0,0x3C,0,0,0,1,0x54,0x10,0x32,0x98]],
  [0x74,[0x10,0x80,0x80,0,0,0x4E,0]],
  [0x35,0],
  [0x21],
    ];
    setTimeout(function () {
        //cmd(0x11); //Exit Sleep
        setTimeout(function () {
            ST7789_INIT_CODE.forEach(function (e) {
                cmd(e[0], e[1]);
            });
            setTimeout(()=>{  //delay_0(120);
              cmd(0x11); }, 120);
            setTimeout(()=>{    //delay_0(120);
              cmd(0x29);}, 240);
            setTimeout(()=>{  //delay_0(120);
              cmd(0x2A,[0,0,0,0xEF]);
              cmd(0x2B,[0,0,0,0xEF]);
              cmd(0x2C);}, 360);
            if (callback) setTimeout(callback, 500);
        }, 20);
    }, 120);
   /**/
}
let connect = function (spi, dc, ce, rst, callback) {
    var g = Graphics.createCallback(LCD_WIDTH, LCD_HEIGHT, 16, {
        setPixel: function (x, y, c) {
            ce.reset();
            spi.write(0x2A, dc);
            spi.write((COLSTART + x) >> 8, COLSTART + x, (COLSTART + x) >> 8, COLSTART + x);
            spi.write(0x2B, dc);
            spi.write((ROWSTART + y) >> 8, ROWSTART + y, (ROWSTART + y) >> 8, (ROWSTART + y));
            spi.write(0x2C, dc);
            spi.write(c >> 8, c);
            ce.set();
        },
        fillRect: function (x1, y1, x2, y2, c) {
            ce.reset();
            spi.write(0x2A, dc);
            spi.write((COLSTART + x1) >> 8, COLSTART + x1, (COLSTART + x2) >> 8, COLSTART + x2);
            spi.write(0x2B, dc);
            spi.write((ROWSTART + y1) >> 8, ROWSTART + y1, (ROWSTART + y2) >> 8, (ROWSTART + y2));
            spi.write(0x2C, dc);
            spi.write({ data: String.fromCharCode(c >> 8, c), count: (x2 - x1 + 1) * (y2 - y1 + 1) });
            ce.set();
        }
    });
    init(spi, dc, ce, rst, callback);
    return g;
};
var g = connect(spi, D47, D3, D2, function() {
  D36.reset();// backlight on
  g.clear();
  g.setColor(0.5,1,1);
  g.setFont("6x8",2);
  
  g.setFontAlign(0,0);
  g.drawString("Espruino",120,40);
  g.setFontVector(12);
  g.drawString("Espruino",120,80);
  
 },500);

  /* SN80 specific */
    function ST7789() {
      var LCD_WIDTH = 240;
      var LCD_HEIGHT = 240;
      var XOFF = 0;
      var YOFF = 0;
      var INVERSE = 1;
      var cmd = lcd_spi_unbuf.command;

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
        [0x35,0],];
    
      function dispinit(rst,fn) {
          function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}
          if (rst) {
              digitalPulse(rst,0,10);
          } else {
              cmd(0x01); //ST7735_SWRESET: Software reset, 0 args, w/delay: 150 ms delay
          }
          delayms(120);
          cmd(0x11); //SLPOUT
          delayms(50);
          ST7789_INIT_CODE.forEach(function (e) {
                  cmd(e[0], e[1]);
          });
          if (INVERSE) {
              //TFT_INVONN: Invert display, no args, no delay
              cmd(0x21);
          } else {
              //TFT_INVOFF: Don't invert display, no args, no delay
              cmd(0x20);
          }
          //TFT_NORON: Set Normal display on, no args, w/delay: 10 ms delay
          cmd(0x13);
          //TFT_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
          cmd(0x29);
          if (fn) fn();
      }
  
      function connect(options , callback) {
          var spi=options.spi, dc=options.dc, ce=options.cs, rst=options.rst;
          var g = lcd_spi_unbuf.connect(options.spi, {
              dc: options.dc,
              cs: options.cs,
              height: LCD_HEIGHT,
              width: LCD_WIDTH,
              colstart: XOFF,
              rowstart: YOFF
          });
          g.lcd_sleep = function(){cmd(0x10);cmd(0x28);};
          g.lcd_wake = function(){cmd(0x29);cmd(0x11);};
          dispinit(rst, ()=>{g.clear(1).setFont("6x8").setFontAlign(0,-1).drawString("Loading...",120,120);});
          return g;
      }

      SPI1.setup({sck:D2, mosi:D3, baud: 8000000});
      return connect({spi:SPI1, dc:D18, cs:D25, rst:D26});
  }

  
  wOS.brightness= function(v) {
      v = Math.round(v/0.125);
      v = v>7?7:v<0?0:v;
      v=v>7?1:v;	
      digitalWrite([D23,D22,D14],7-v);
  };

  
  
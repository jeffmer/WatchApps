function ST7789() {
    var LCD_WIDTH = 240;
    var LCD_HEIGHT = 280;
    var XOFF = 0;
    var YOFF = process.env.BOARD=="ROCK"?24:20;
    var INVERSE = 0;
    var MIRROR = 1;
    var cmd = lcd_spi_unbuf.command;
    
    
    var MADCTL_MY  = 0x80;
    var MADCTL_MX  = 0x40; 
    var MADCTL_MV  = 0x20; 
    var MADCTL_BGR = 0x08; 

    function dispinit(rst,fn) {
        function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}
        if (rst) {
            digitalPulse(rst,0,10);
        } else {
            cmd(0x01); //ST7735_SWRESET: Software reset, 0 args, w/delay: 150 ms delay
        }
        delayms(120);   // no apps to run 
        cmd(0x11); //SLPOUT
        delayms(50);
        
        //MADCTL: Set Memory access control (directions), 1 arg: row addr/col addr, bottom to top refresh
        if(MIRROR){
            cmd(0x36, MADCTL_MX | MADCTL_BGR);
        }
        else{
            cmd(0x36, 0x00);
        }
        
   cmd(0xDF,[0x98,0x51,0xE9]);
  cmd(0xDE,0x00);
  cmd(0xB7,[0x34,0x9a,0x3d,0x17]);
  cmd(0xC8, [0x3F, 0x34, 0x2F, 0x2E, 0x32, 0x39, 0x36, 0x36, 0x35, 0x33, 0x2D, 0x21, 0x18, 0x16, 0x10, 0x00, 0x34, 0x2F, 0x2E, 0x32, 0x39, 0x36, 0x36, 0x35, 0x33, 0x2D, 0x21, 0x18, 0x16, 0x10, 0x00, 0x00]);
  cmd(0xB9,[0x33,0x08,0xCC]);
  cmd(0xBB, [0x40, 0x7A, 0x40, 0xE0, 0x6C, 0x60, 0x50, 0x70]);
  cmd(0xbc,[0x38,0x3c]);
  cmd(0xc0,[0x34,0x20]);
  cmd(0xC1,0x12);
  cmd(0xC3, [0x08, 0x00, 0x0F, 0x1F, 0x1C, 0x7A, 0x7C, 0x94, 0x2C]);
  cmd(0xC4, [0x00, 0x96, 0xEF, 0x1D, 0x0A, 0x16, 0xD0, 0x0E, 0x0A, 0x16, 0xD0, 0x0E, 0x0A, 0x16, 0x82, 0x00, 0x03]);
  cmd(0xD0,[0x04,0x3f,0x90,0x0e,0x00,0x03]);
  cmd(0xDE,0x02);
  cmd(0xB8,[0x1d,0xae,0x2f,0x08,0x34]);
  cmd(0xC1,[0x10,0x66,0x66,0x01]);
  cmd(0xc4,[0x7e,0x0f]);
  cmd(0xDE,0x00);
  cmd(0x3a,0x03]);// 12bpp = 0x03, 16bpp = 0x05
  cmd(0x11);     

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
        dispinit(rst, ()=>{g.clear(1).setFont("6x8").drawString("Loading...",20,20);});
        return g;
    }

    //var spi = new SPI();
    SPI1.setup({sck:D45, mosi:D44, baud: 32000000});

    return connect({spi:SPI1, dc:D47, cs:D3, rst:D2});
}

wOS.brightness= function(v){
    v = v>1?1:v<0?0:v;
    if (v==0||v==1)
        digitalWrite(D12,v);
      else
        analogWrite(D12,v,{freq:60});
};

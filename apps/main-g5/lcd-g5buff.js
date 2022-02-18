
  /* G5 specific */
  function AMOLED() {
    var LCD_WIDTH = 454;
    var LCD_HEIGHT = 454;
    var XOFF = 16;
    var YOFF = 0;
    var INVERSE = 1;
    var cmd = lcd_amoled.command;
    function delayms(d) {var t = getTime()+d/1000; while(getTime()<t);}
    
    function dispinit(rst,fn) {
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
        cmd(0x35,0x00);
        cmd(0x36,0xC0);
        cmd(0x3A,0x72);  // 8 bit 
        delayms(10);
        cmd(0x53,0x20);
        cmd(0xC4,0x80);
        cmd(0x11);
        delayms(120);
        cmd(0x29);
        D34.reset();
        cmd(0x51,0xFF); //Brightness 0x90 0xC0 0xFF
        if (fn) fn();
    }

    function connect(options , callback) {
        var spi=options.spi, dc=options.dc, ce=options.cs, rst=options.rst;
        var g = lcd_amoled.connect(options.spi, {
            dc: options.dc,
            cs: options.cs,
            height: LCD_HEIGHT,
            width: LCD_WIDTH,
            colstart: XOFF,
            rowstart: YOFF
        });
        g.cmd = cmd;
        g.setPaletteColor = lcd_amoled.setPaletteColor;
        g.brightness = function(v){cmd(0x51,v);};
        g.lowpower   = function(b){cmd(0xFE); if (b) cmd(0x39); else cmd(0x38);};
        g.lcd_sleep = function(){D34.set();cmd(0x10);cmd(0x28);D3.reset();}; //set brightness 0 before sleep
        g.lcd_wake = function(){D3.set();D34.reset();cmd(0x11);cmd(0x29);};// set brightness after sleep
        dispinit(rst, ()=>{g.clear(1).setColor(0xffff).setFont("6x8",2).setFontAlign(0,-1).drawString("Loading...",240,240);});
        return g;
    }

    SPI1.setup({sck:D5, mosi:D11, baud: 32000000});
    return connect({spi:SPI1, dc:D27, cs:D26, rst:D40});
}


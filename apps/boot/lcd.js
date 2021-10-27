/* 
Copyright (c) 2015 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission.

Updated for use in ROCK smartwatch by Jeff Magee
 */

function ST7789() {
    var LCD_WIDTH = 240;
    var LCD_HEIGHT = 280;
    var XOFF = 0;
    var YOFF = 0;
    var INVERSE = 1;
    var cmd = lcd_spi_unbuf.command;

    function dispinit(rst,fn) {
        if (rst) {
            digitalPulse(rst,0,10);
        } else {
            cmd(0x01); //ST7735_SWRESET: Software reset, 0 args, w/delay: 150 ms delay
        }
        setTimeout(function() {
        cmd(0x11); //SLPOUT
        setTimeout(function() {
            //MADCTL: Set Memory access control (directions), 1 arg: row addr/col addr, bottom to top refresh
            cmd(0x36, 0x00);
            //COLMOD: Set color mode, 1 arg, no delay: 16-bit color
            cmd(0x3a, 0x05);
            //PORCTRL: Porch control
            cmd(0xb2, [0x0b, 0x0b, 0x33, 0x00, 0x33]);
            //GCTRL: Gate control
            cmd(0xb7, 0x11);
            // VCOMS: VCOMS setting
            cmd(0xbb, 0x35);
            //LCMCTRL: CM control
            cmd(0xc0, 0x2c);
            //VDVVRHEN: VDV and VRH command enable
            cmd(0xc2, 0x01);
            // VRHS: VRH Set
            cmd(0xc3, 0x08);
            // VDVS: VDV Set
            cmd(0xc4, 0x20);
            //VCMOFSET: VCOM Offset Set .
            cmd(0xC6, 0x1F);
            //PWCTRL1: Power Control 1
            cmd(0xD0, [0xA4, 0xA1]);
            // PVGAMCTRL: Positive Voltage Gamma Control
            cmd(0xe0, [0xF0, 0x04, 0x0a, 0x0a, 0x08, 0x25, 0x33, 0x27, 0x3d, 0x38, 0x14, 0x14, 0x25, 0x2a]);
            // NVGAMCTRL: Negative Voltage Gamma Contro
            cmd(0xe1, [0xf0, 0x05, 0x08, 0x07, 0x06, 0x02, 0x26, 0x32, 0x3d, 0x3a, 0x16, 0x16, 0x26, 0x2c]);
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
          }, 50);
          }, 120);
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
        dispinit(rst, ()=>{g.clear().setFont("Vector",24).drawString("P8 Expruino",40,100);});
        return g;
    }

    //var spi = new SPI();
    SPI1.setup({sck:D45, mosi:D44, baud: 32000000});

    return connect({spi:SPI1, dc:D47, cs:D3, rst:D2});
}

global.ROCK = {}

//screen brightness function
ROCK.setLCDBrightness = function(val){
    var val = val>1 ? 1 : val<0 ? 0: val;
    if (val==0||val==1)
        digitalWrite(D12,val);
      else
        analogWrite(D12,val,{freq:60});
};

var g = ST7789();

ROCK.setLCDBrightness(0.5);

D7.set(); //turn off LED

setTimeout(()=>{
    g.setFont("6x8",2).drawString("Time Test",40,80);
},500);

function sleep(){
    ROCK.setLCDBrightness(0);
    g.lcd_sleep();
}

function wake(){
    ROCK.setLCDBrightness(0.5);
    g.lcd_wake();
}

function time_fill(){
    g.setColor(0x07E0);
    var time= Date.now();
    g.fillRect(0,80,239,239);
    g.flip();
    time = Math.floor(Date.now()-time);
    console.log("Time to Draw Rectangle: "+time+"ms");
}

var pal1color = new Uint16Array([0x0000,0xF100]);
var buf = Graphics.createArrayBuffer(240,160,1,{msb:true});
buf.setColor(1);
buf.fillRect(0,0,239,159);

function time_image(){
    var time= Date.now();
    g.drawImage({width:240,height:160,bpp:1,buffer:buf.buffer, palette:pal1color},0,80);
    g.flip();
    time = Math.floor(Date.now()-time);
    console.log("Time to Draw Image: "+time+"ms");
}



  

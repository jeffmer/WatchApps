function screenshot(draw) {
    var _g = g;
    Bluetooth.print("data:image/bmp;base64,");
    var l = 26/*header length*/ + 240*3;
    var data = E.toString([66,77,l&255,l>>8, // 0
                  0,0,0,0,0,0,      // 4
                  26,0,0,0,         // 10
                  12,0,0,0,240,0,240,0,1,0,24,0]); // 14
    var b = Graphics.createArrayBuffer(240,1,24);
    g = Graphics.createCallback(240,240,16,{
        setPixel:function(x,y,c) { b.setPixel(x,y-yo,((c&0xF800)<<8) | ((c&0x7E0)<<5) | ((c&0x1F)<<3)); },
        fillRect:function(x1,y1,x2,y2,c) { b.setColor(((c&0xF800)<<8) | ((c&0x7E0)<<5) | ((c&0x1F)<<3)).fillRect(x1,y1-yo,x2,y2-yo); }
      });
    g.flip = function(){};
    var t = getTime(), t2=t;
    for (var yo=239;yo>=0;yo--) {
      E.kickWatchdog();
      g.setClipRect(0,yo,239,yo);
      b.clear();
      t2 += getTime()-t;setTime(t);
      draw();
      var n = 0;
      while (data.length%3) data += String.fromCharCode(b.buffer[n++]);
      Bluetooth.print(btoa(data));
      data = E.toString(b.buffer).substr(n);
    }
    setTime(t2);
    Bluetooth.println(btoa(data));
    g = _g;
  }
  
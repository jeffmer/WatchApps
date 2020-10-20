E.showMessage("Scanning...");
require("Font6x8").add(Graphics);

var devices = [];

setInterval(function() {
  NRF.findDevices(function(devs) {
    devs.forEach(dev=>{
      var existing = devices.find(d=>d.id==dev.id);
      if (existing) {
        existing.timeout = 0;
        existing.rssi = (existing.rssi*3 + dev.rssi)/4;
      } else {
        dev.timeout = 0;
        dev.new = 0;
        devices.push(dev);
      }
    });
    devices.forEach(d=>{d.timeout++;d.new++});
    devices = devices.filter(dev=>dev.timeout<8);
    devices.sort((a,b)=>b.rssi - a.rssi);
    g.clear(1);
    g.setFont6x8();
    devices.forEach((d,y)=>{
      y*=8;
      var n = d.name;
      if (!n) n=d.id.substr(0,22);
      if (d.new<4) {
        g.fillRect(0,y,g.getWidth(),y+7);
        g.setColor(0);
      } else {
        g.setColor(1);
      }
      g.setFontAlign(-1,-1);
      g.drawString(n,0,y);
      g.setFontAlign(1,-1);
      g.drawString(0|d.rssi,g.getWidth()-1,y);
    });
    g.flip();
  }, 1200);
}, 1500);

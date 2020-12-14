function update() {
  var t = Math.round(E.getTemperature()*100);
  NRF.setAdvertising({
    0x1809 : [t&255, t>>8]
  }, { showName:false, connectable: false, scannable:false });
  // If graphics is defined
  if (global.g) {
    g.clear(1);
    var txt = currentTemp.toFixed(1);
    var fontSize = g.getHeight()-8;
    g.setFontAlign(0,0);
    g.drawString("Temperature",g.getWidth()/2,4);
    g.setFontVector(fontSize);
    while (g.stringWidth(txt) > g.getWidth()) {
      g.setFontVector(--fontSize);
    }
    g.drawString(txt, g.getWidth()/2, 4+g.getHeight()/2);
    g.flip();
  }
}

setInterval(update, 30000);
update();
// More TX power
NRF.setTxPower(4);

function update() {
  var t = Math.round(E.getTemperature()*100);
  NRF.setAdvertising({
    0x1809 : [t&255, t>>8]
  }, { showName:false, connectable: false, scannable:false });
}

setInterval(update, 30000);
update();

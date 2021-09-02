function displayInfo(reading) {
  g.clear();
  if (!reading) {
    g.drawString("No Tilt found");
  } else {
    g.drawString("Temperature",0,0);
    g.drawString("Gravity",0,30);
    g.setFontVector(20);
    g.setFontAlign(0,-1);
    g.drawString(reading.F.toFixed(1),64,6);
    g.drawString(reading.gravity,64,36);
    g.setFontAlign(-1,-1);
    g.setFontBitmap();
    g.drawString(reading.color, 55, 57);
  }
  g.flip();
}

function arrayBufferToHex (arrayBuffer){
  return (new Uint8Array(arrayBuffer)).slice().map(x=>(256+x).toString(16).substr(-2)).join("");
}

var TILT_DEVICES = {
  'a495bb30c5b14b44b5121370f02d74de': 'Black',
  'a495bb60c5b14b44b5121370f02d74de': 'Blue',
  'a495bb20c5b14b44b5121370f02d74de': 'Green',
  'a495bb50c5b14b44b5121370f02d74de': 'Orange',
  'a495bb80c5b14b44b5121370f02d74de': 'Pink',
  'a495bb40c5b14b44b5121370f02d74de': 'Purple',
  'a495bb10c5b14b44b5121370f02d74de': 'Red',
  'a495bb70c5b14b44b5121370f02d74de': 'Yellow',
};

var failures = 0;

function takeReading() {
  // scan for 5 seconds max
  NRF.setScan(function(device) {
    d = new DataView(device.manufacturerData);
    if (d.getUint8(4) == 0xbb) {
      var hexData = arrayBufferToHex(device.manufacturerData);
      var tempF = d.getUint16(18);
      var tempC = ( tempF - 32) * 5 / 9;
      var gravity = d.getUint16(20) / 1000.0;
      var color = TILT_DEVICES[hexData.substr(4,32)];
      readings= {
        C:tempC,
        F:tempF,
        gravity:gravity,
        d:device.manufacturerData,
        color: color,
      };
      failures=0;
      NRF.setScan();
      if (notFoundTimeout) clearTimeout(notFoundTimeout);
      notFoundTimeout = undefined;
      displayInfo(readings);
    }
  }, { filters: [{ manufacturerData: { 0x004C: {} } }]});
  // stop scanning after 5 seconds
  var notFoundTimeout = setTimeout(function() {
    NRF.setScan();
    notFoundTimeout = undefined;
    failures++;
    if (failures>5) displayInfo();
  }, 5000);
}

// Scan every minute
setInterval(function() {
  takeReading();
}, 60*1000);
// Scan once at boot/upload
takeReading();

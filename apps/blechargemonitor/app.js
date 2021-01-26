var Averager = require("Averager").Averager;
var volts, amps;
var voltAvr = new Averager({scale:1000});
var ampAvr = new Averager({scale:1000});

function onSecond() {
  amps = analogRead(D29)*3.3;
  volts = analogRead(D31)*3.6*4.77;
  
  voltAvr.add(volts);
  ampAvr.add(amps);
  
  var data = {
    v:Math.round(volts*100)/100,
    b:Math.round(amps*100)/100
  };
  NRF.setAdvertising({},{
    name:"\xF0\x9F\x9A\x98", // car emoji, https://apps.timwhitlock.info/emoji/tables/unicode
    manufacturer:0x0590,
    manufacturerData:JSON.stringify(data)
  });
}
setInterval(onSecond, 1000);

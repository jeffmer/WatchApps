function Averager(size, scale) {
  Object.assign(this,{
    lastBuckets : new Uint16Array(size),
    buckets : new Uint16Array(size),
    scale : scale,
    sum : 0,
    cnt : 0,
    lastBucket : 0,
  });
}
Averager.prototype.add = function(value, bucket) {
  if (bucket != this.lastBucket) {
    this.sum = this.cnt = 0;
    if (bucket < this.lastBucket) {
      this.lastBuckets.set(buckets);
      this.buckets.fill(0);
    }
    this.lastBucket = bucket;
  }
  this.sum += value;
  this.cnt ++;
  this.buckets[bucket] = Math.round(this.sum*this.scale/this.cnt);
};
Averager.prototype.get = function() {
  return this.buckets.slice().map(x => x/this.scale );
};
Averager.prototype.getLast = function() {
  return this.lastBuckets.slice().map(x => x/this.scale );
};

var currentTemp;
var hours = new Averager(12*4, 100);
var days = new Averager(31, 100);

function getTemperature() {
  currentTemp = E.getTemperature();
  var d = new Date();
  hours.add(currentTemp, Math.round(d.getHours()*2 + d.getMinutes()/15));
  days.add(currentTemp, d.getDate()-1);
  // update advertising to include temperature
  var t = Math.round(currentTemp*100);
  NRF.setAdvertising({
    0x1809 : [t&255, t>>8]
  }, { });
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

setInterval(getTemperature, 1000);
getTemperature();

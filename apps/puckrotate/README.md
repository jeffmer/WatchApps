# Puck.js Rotation Advertising

Uses a combination of the Gyro and accelerometer to detect rotation of the Puck.js
(rotated as if it were a knob, standing vertically) and advertise the amount it has been rotated over Bluetooth.

When moving the gyro is used to modify the rotation value, but when stationary
the earth's gravity is used to adjust the rotation to the correct absolute value
to adjust for inaccuracy in the gyro.

The data is advertised as JSON (`{r:...}`) with the Espruino Manufacturer ID of `0x0590`

## Usage

Just upload the app. You can then receive the data from it with something like
this running on another Espruino device:

```JS
function foundDevice(d) {
  var j;
  try { j = JSON.parse(E.toString(d.manufacturerData)); }
  catch (e) { return; }
  if (j.r) print(j);
}

NRF.setScan(foundDevice, {filters : [{ manufacturerData:{0x0590:{}} }] });
```

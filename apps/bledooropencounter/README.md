# Bluetooth Door Opening Counter

Uses the magnetometer to detect when a magnet is nearby (door closed) or not (door open), and advertises the number of door openings.

The data is advertised as JSON (`{n:...}`) with the Espruino Manufacturer ID of `0x0590`

## Usage

Just upload the app. You can then receive the data from it with something like
this running on another Espruino device:

```JS
function foundDevice(d) {
  var j;
  try { j = JSON.parse(E.toString(d.manufacturerData)); }
  catch (e) { return; }
  if (j.n) print(j);
}

NRF.setScan(foundDevice, {filters : [{ manufacturerData:{0x0590:{}} }] });
```

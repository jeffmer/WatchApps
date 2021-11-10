Bangle.setGPSPower = function(on){
    if (Bangle.gpsgatt) return; //already started
    function unpack(v){
        var fix = v.getInt8(29);
        function ck(d) {return d==-1 ? NaN : d;}
        return {
          lat:ck(v.getFloat32(0)),
          lon:ck(v.getFloat32(4)),
          alt:ck(v.getFloat32(8)),
          speed:ck(v.getFloat32(12)),
          course:ck(v.getFloat32(16)),
          time:new Date(v.getFloat64(20)),
          satellites:v.getInt8(28),
          fix:fix,
          hdop:ck(v.getFloat32(30)),
        }
    }
    if (on) {
        NRF.requestDevice({ filters: [{ name: 'gps' }] }).then(function(device) {
        //console.log("Found");
        return device.gatt.connect();
        }).then(function(g) {
            //console.log("Connected");
            Bangle.gpsgatt = g;
            return g.getPrimaryService("974e0001-1b9a-4468-a83d-7f811b3dbaff");
        }).then(function(service) {
            return service.getCharacteristic("974e0002-1b9a-4468-a83d-7f811b3dbaff");
        }).then(function (c) {
            Bangle.gpscharistic=c;
            //console.log("Got Characteristic");
            Bangle.gpsInterval = setInterval(function(){
                Bangle.gpscharistic.readValue().then(function(d){
                    Bangle.gpsFix=unpack(d);
                    Bangle.emit("GPS",Bangle.gpsFix);
                });
            },1000);
        }).catch(function(e){
            E.showMessage("GPS: "+e,"ERROR");
        });
    } else {
        if (Bangle.gpsInterval) Bangle.gpsInterval = clearInterval(Bangle.gpsInterval);
        if(Bangle.gpsgatt) Bangle.gpsgatt.disconnect();
        delete Bangle.gpsgatt;
        delete Bangle.gpscharistic;
    }
}

Bangle.getGPSFix = function() {return Bangle.gpsFix;}

Bangle.project = E.project;

//Bangle.on("GPS",(d)=>{console.log(d);});


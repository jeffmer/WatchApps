function accel_calibrate(menu){

  function calibrate(){
    var max={x:-32000, y:-32000, z:-32000},
        min={x:32000, y:32000, z:32000};
    var ref = setInterval(()=>{
        var m = ACCEL.read();
        max.x = m.x>max.x?m.x:max.x;
        max.y = m.y>max.y?m.y:max.y;
        max.z = m.z>max.z?m.z:max.z;
        min.x = m.x<min.x?m.x:min.x;
        min.y = m.y<min.y?m.y:min.y;
        min.z = m.z<min.z?m.z:min.z;
    }, 500);
    return new Promise((resolve) => {
      setTimeout(()=>{
        if(ref) clearInterval(ref);
        var offset = {x:(max.x+min.x)/2,y:(max.y+min.y)/2,z:(max.z+min.z)/2};
        var delta  = {x:(max.x-min.x)/2,y:(max.y-min.y)/2,z:(max.z-min.z)/2};
        var scale = {x:Math.floor(1024000/delta.x), y:Math.floor(1024000/delta.y), z:Math.floor(1024000/delta.z)};
        resolve({offset:offset,scale:scale});
      },65000);
    });
  }

  var cx = g.getWidth()/2;
  var cy = g.getHeight()/2;
  Bangle.setLCDTimeout(70);
  Bangle.setLCDPower(true);
  g.clear().setFont("Vector",24).setFontAlign(0,0).drawString("Calibrate\nAccelerometer",cx,cy);
  function message(s,t){
    setTimeout(()=>{g.clear().drawString(s,cx,cy);},t*1000);
  }
  message("End Up",5);
  message("End Down",15);
  message("Edge Up",25);
  message("Edge Down",35);
  message("Face Up",45);
  message("Face Down",55);
  calibrate ().then((res)=>{
    Bangle.buzz();
    g.clear().drawString("Finished",cx,cy);
    require("Storage").write("accel.json",res);
    setTimeout(()=>E.showMenu(menu),2000);
  });
}


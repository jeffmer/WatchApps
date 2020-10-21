var ship;
// We're assuming a 128x64 screen here
var ground = [
  0,110,
  15,110,
  25,120,
  63,125,
  63,127, // bottom edge
  0,127    // bottom edge
];
var animInterval;
if (g.getWidth()>g.getHeight())
  g.setRotation(3); // rotate 90 degrees to matcch lander orientation

function onFrame() {
  if (BTN2.read()) ship.r-=0.05;
  if (BTN3.read()) ship.r+=0.05;
  var accel = 0;
  if (BTN4.read()) {
    accel=0.02;
    ship.fuel++;
  }
  ship.vx += - accel*Math.sin(ship.r);
  ship.vy += - accel*Math.cos(ship.r) + 0.01 /*gravity*/;
  ship.x += ship.vx;
  if (ship.x<0) ship.x+=64;
  if (ship.x>63) ship.x-=64;
  ship.y += ship.vy;
  g.clear();
  g.fillPoly(ground);
  // Now check to see if we've crashed or not
  if (g.getPixel(ship.x+Math.sin(ship.r)*2,ship.y+Math.cos(ship.r)*2)) {
    console.log(ship.vx, ship.vy, ship.r);
    var crash;
    if (Math.abs(ship.vx)>0.1) crash="Moving Sideways";
    else if (Math.abs(ship.vy)>0.15) crash="Landed too hard";
    else if (Math.abs(ship.r)>0.3) crash="Not straight";
    if (crash)
      gameStop("-= CRASH =-",crash);
    else
      gameStop("You win!",ship.fuel+" fuel used");
  }

  g.drawPoly([ // draw the ship!
    ship.x-Math.sin(ship.r)*8,   ship.y-Math.cos(ship.r)*8,
    ship.x-Math.sin(ship.r+2)*3, ship.y-Math.cos(ship.r+2)*3,
    ship.x-Math.sin(ship.r-2)*3, ship.y-Math.cos(ship.r-2)*3
  ], true);
  g.flip();
}

function gameStop(title, reason) {
  clearInterval(animInterval);
  animInterval = 0;
  g.setFontAlign(0,0);
  g.drawString(title,32,48);
  if (reason) g.drawString(reason,32,64);
  g.flip();
  // enable new game after 2 seconds
  setTimeout(function() {
    g.drawString("Press BTN4",32,80);
    g.flip();
    setWatch(gameStart,BTN4);
  }, 2000);
}

function gameStart() {
  ship = {
    x : 32, y : 16,
    vx : 0, vy : 0,
    fuel : 0,
    r : 0 // rotation
  };
  animInterval = setInterval(onFrame, 20);
}

gameStart();

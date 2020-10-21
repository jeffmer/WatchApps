var BATSIZE = 8;
var score = 0;
var batl = g.getHeight()/2;
var ball;
var blocks = [];


function newGame() {
  blocks = [
    new Array(7),
    new Array(7),
    new Array(7),
    new Array(7)
  ];
  blocks[0].fill(true);
  blocks[1].fill(true);
  blocks[2].fill(true);
  blocks[3].fill(true);
  ball = {
    x : g.getWidth()/2,
    y : g.getHeight()/2,
    vx : (Math.random()>0.5)?2:-2,
    vy : (Math.random()-0.5)*4
  };
}

function onFrame() {
  if (BTN1.read()) batl-=2;
  if (BTN4.read()) batl+=2;
  if (batl<BATSIZE) batl=BATSIZE;
  if (batl>g.getHeight()-BATSIZE) batl=g.getHeight()-BATSIZE;

  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y<=0) ball.vy = Math.abs(ball.vy);
  if (ball.y>=g.getHeight()-1) ball.vy = -Math.abs(ball.vy);
  if (ball.x<5 &&
      ball.y>batl-BATSIZE && ball.y<batl+BATSIZE) {
    ball.vx = Math.abs(ball.vx);
  }
  if (ball.x>g.getWidth()-1) {
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.x<0) {
    score-=8;
    newGame();
  }

  g.clear();
  g.fillRect(0,batl-BATSIZE, 3,batl+BATSIZE);
  g.fillRect(ball.x-1,ball.y-1,ball.x+1,ball.y+1);
  g.drawString(score, 10,0);

  var hasBlock = false;
  blocks.forEach(function(blockLine,by) {
    blockLine.forEach(function(block,bx) {
      if (!block) return;
      var x = by*8+96, y = bx*8+8;
      if (ball.x>x-5 && ball.y>y-5 &&
          ball.x<x+5 && ball.y<y+5) {
        blockLine[bx]=false;
        score++;
        // it's a hit
        if (Math.abs(ball.x-x)>Math.abs(ball.y-y)) {
          // bounce off x
          ball.vx = Math.abs(ball.vx)*(ball.x>x?1:-1);
        } else { // bounce off y
          ball.vy = Math.abs(ball.vy)*(ball.y>y?1:-1);
        }
      } else {
        g.fillRect(x-3,y-3,x+3,y+3);
        hasBlock = true;
      }
    });
    if (!hasBlock) {
      score += 20;
      newGame();
    }
  });

  g.flip();
}

newGame();
setInterval(onFrame, 50);

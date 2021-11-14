const storage = require("Storage");

eval(storage.read("hearts.js"));
eval(storage.read("spades.js"));


function card_back() {
  return require("heatshrink").decompress(atob("sGTgkRj//AFURAAIurGAResAAPxF1ovwAGeIAFAuE+Yv/F/4v/F/4vin4JEADn4F5f/mYAgEwgvIRcIv/F/4v/F/4v/F9szmYvqwYtBAAc4F8wuBC4n/GBovYwfzFwoABn4wLF64uJMIQvin4uJDQIbDF7uDF4oFCBAiRJF6zrDn7wGDgwvbLwwYFBYYvex69LF4XzSBAvVRIXzGBIDCmYvcRxb1FJJAvVLI8zmY5GSBAvURwQkFwYBBGAwvcEYpTCx/4NY7AHF7QiCW4Y8GF7SDGLwJbCAggvkCAQHCSA4vcCAwHEGofzZggvbEIa5FMAIGCGQQvdRIePC4gTBZo6PenAnFG4IvjR4YuFA4IvuTYbvgABYvhEIo0MDwYvXxCxFmZaCGgQGCToYvhCIWPAYQMIF7//WQIVCLwRsEF7bwCXofzmaPBAQIHCAYTuGF7hVCLowOBF7qQDSgwAGDIwvVWgZgFAA6+HF62PCAYuKRxAvWYASQCSIg2En4YHF62IFQgvI+f4F75gESZBeJF65gBLgi9PF7OImYvKCxQvYwYwImYVKF7IwCd4szRpQvbSQQAECZovbACYv/F/4v/F/4v/F/4v/F/4v/F/4v/F/4vawczAAgvnFwIXFmc4F8mD+YWEAAQwMF7BdFGAovin4uJDQP4F8GDF4qTGn4vgRoYsFHAhgJF6uDFRI2FF72PXpQ2D+c4F7qODeJHzBIUzF7jtGF46QLF6opHmZoDGAaQIF6glCKgYkBAQJqDSAYvcRwpTC//4NY7AHF6xeDmeDBAP4wc4HgwvaQYYCFG4bCEF8DBFABIvcCAoqHHorwGF8rQCF9gACF8E4E4v//Avm/AGFG4gCCF7szCAePGwmIXgS/kDAoFBR4gvcEIopELwI9IF7yxCFQRtKF7CBFSAhkFF8xgBn6OBfIQADmYvbEYQyDGAOPBQI7FTgQvaWQoTCmZdGNYYvbKgXzFIwAGDIwvVSAfzGBBjDXw4vWx4QDXIzKDRxAvWYAaQMDA4vWSAaLGMon4F77xDMIZkFn4XIF6+IXg4aELxIvYSJCUDCxQvYwbvImc4F8YwBMIvzFxgvaGAQAECZgvbACgv/F/4v/F/4v/F/4vNmYAgF5k/BIgAc/AvLAEwv/F/4v/F+n/mYAoF4oA/ADfxj4vtmIvuiMRn6OsF4MRF1o"));
}


function createDeck() {
  var suits = ["spades", "hearts"];
  var values = ["3","4","5", "6", "7", "8", "9", "10", "11", "12", "13", "1"];

  var dck = [];
  for (var i = 0 ; i < values.length; i++) {
    for(var x = 0; x < suits.length; x++) {
      dck.push({ Value: values[i], Suit: suits[x], State:0});
    }
  }
  return dck;
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

var deck;

function drawCard(row,col) {
    if (deck[row*6+col].State==0) 
       g.drawImage(card_back(), col*40, row*60,{scale:0.4});
    else if (deck[row*6+col].State==1) 
      g.drawImage(eval(deck[row*6+col].Suit+"("+deck[row*6+col].Value+")"),col*40,row*60,{scale:0.4});
    else
      g.setColor(0).fillRect(col*40, row*60, col*40+39, row*60+59);
}

function drawStart(){
  for (var i=0;i<4;i++){
    for(var j=0;j<6;j++){
        drawCard(i,j);
    }
  }
}

function startGame(){
  g.clear();
  deck = createDeck();
  deck = shuffle(deck);
  drawStart();
}

var first;
var matching=false;
var pairs = 0;
var tries = 0;

function match(t){
  if (first  && first.R==t.R  && first.C==t.C) return;
  if (deck[t.R*6+t.C].State==2 || matching) return;
  deck[t.R*6+t.C].State =1;
  drawCard(t.R,t.C);
  if (!first) {
    first = t;
    return;
  } else if (deck[t.R*6+t.C].Value == deck[first.R*6+first.C].Value){
    deck[first.R*6+first.C].State =2;
    deck[t.R*6+t.C].State =2;
    ++pairs;
    if (pairs==12) E.showMessage("Game Over\nTries: "+tries,"PAIRS");
  } else {
    deck[first.R*6+first.C].State =0;
    deck[t.R*6+t.C].State =0;
  }
  matching=true;
  ++tries;
  setTimeout(()=>{
    drawCard(t.R,t.C);
    drawCard(first.R,first.C);
    first=null;
    matching=false;
  },2000);
}

TC.on("touch",(p)=> {
      var col = Math.floor(p.x/40);
      var row = Math.floor(p.y/60);
      match({R:row,C:col});
});


setTimeout(startGame,500);


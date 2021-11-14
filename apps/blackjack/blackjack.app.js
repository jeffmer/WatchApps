const storage = require("Storage");
eval(storage.read("clubs.js"));
eval(storage.read("diamonds.js"));
eval(storage.read("hearts.js"));
eval(storage.read("spades.js"));

function card_back() {
  return require("heatshrink").decompress(atob("sGTgkRj//AFURAAIurGAResAAPxF1ovwAGeIAFAuE+Yv/F/4v/F/4vin4JEADn4F5f/mYAgEwgvIRcIv/F/4v/F/4v/F9szmYvqwYtBAAc4F8wuBC4n/GBovYwfzFwoABn4wLF64uJMIQvin4uJDQIbDF7uDF4oFCBAiRJF6zrDn7wGDgwvbLwwYFBYYvex69LF4XzSBAvVRIXzGBIDCmYvcRxb1FJJAvVLI8zmY5GSBAvURwQkFwYBBGAwvcEYpTCx/4NY7AHF7QiCW4Y8GF7SDGLwJbCAggvkCAQHCSA4vcCAwHEGofzZggvbEIa5FMAIGCGQQvdRIePC4gTBZo6PenAnFG4IvjR4YuFA4IvuTYbvgABYvhEIo0MDwYvXxCxFmZaCGgQGCToYvhCIWPAYQMIF7//WQIVCLwRsEF7bwCXofzmaPBAQIHCAYTuGF7hVCLowOBF7qQDSgwAGDIwvVWgZgFAA6+HF62PCAYuKRxAvWYASQCSIg2En4YHF62IFQgvI+f4F75gESZBeJF65gBLgi9PF7OImYvKCxQvYwYwImYVKF7IwCd4szRpQvbSQQAECZovbACYv/F/4v/F/4v/F/4v/F/4v/F/4v/F/4vawczAAgvnFwIXFmc4F8mD+YWEAAQwMF7BdFGAovin4uJDQP4F8GDF4qTGn4vgRoYsFHAhgJF6uDFRI2FF72PXpQ2D+c4F7qODeJHzBIUzF7jtGF46QLF6opHmZoDGAaQIF6glCKgYkBAQJqDSAYvcRwpTC//4NY7AHF6xeDmeDBAP4wc4HgwvaQYYCFG4bCEF8DBFABIvcCAoqHHorwGF8rQCF9gACF8E4E4v//Avm/AGFG4gCCF7szCAePGwmIXgS/kDAoFBR4gvcEIopELwI9IF7yxCFQRtKF7CBFSAhkFF8xgBn6OBfIQADmYvbEYQyDGAOPBQI7FTgQvaWQoTCmZdGNYYvbKgXzFIwAGDIwvVSAfzGBBjDXw4vWx4QDXIzKDRxAvWYAaQMDA4vWSAaLGMon4F77xDMIZkFn4XIF6+IXg4aELxIvYSJCUDCxQvYwbvImc4F8YwBMIvzFxgvaGAQAECZgvbACgv/F/4v/F/4v/F/4vNmYAgF5k/BIgAc/AvLAEwv/F/4v/F+n/mYAoF4oA/ADfxj4vtmIvuiMRn6OsF4MRF1o"))
}

var deck = [];
var player = {Hand:[]};
var computer = {Hand:[]};

function createDeck() {
  var suits = ["spades", "hearts", "diamonds", "clubs"];
  var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1"];

  var dck = [];
  for (var i = 0 ; i < values.length; i++) {
    for(var x = 0; x < suits.length; x++) {
      dck.push({ Value: values[i], Suit: suits[x] });
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

function EndGameMessdage(msg){
  g.drawString(msg, 155, 200);
  //setTimeout(function(){
  //  startGame();
  //}, 2500);
}

function hitMe() {
  player.Hand.push(deck.pop());
  renderOnScreen(1);
  var playerWeight = calcWeight(player.Hand, 0);

  if(playerWeight == 21)
    EndGameMessdage('WINNER');
  else if(playerWeight > 21)
    EndGameMessdage('LOSER'); 
}

function calcWeight(hand, hideCard) {
    
  if(hideCard === 1) {
    if (hand[0].Value == "11" || hand[0].Value == "12" || hand[0].Value == "13")
      return "10 +";
    else if (hand[0].Value == "1")
      return "11 +";
    else
      return parseInt(hand[0].Value) +" +";
  }
  else {
    var weight = 0;
    for(i=0; i<hand.length; i++){
      if (hand[i].Value == "11" || hand[i].Value == "12" || hand[i].Value == "13") {
        weight += 10;
      }
      else if (hand[i].Value == "1") {
        weight += 1;
      }
      else
        weight += parseInt(hand[i].Value);
    }

    // Find count of aces because it may be 11 or 1
    var numOfAces = hand.filter(function(x){ return x.Value === "1"; }).length;
    for (var j = 0; j < numOfAces; j++) {
      if (weight + 10 <= 21) {
        weight +=10;
      }
    }
    return weight;
  }
}

function stand(){
  function sleepFor( sleepDuration ){
    console.log("Sleeping...");
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
  }

  renderOnScreen(0);
  var playerWeight = calcWeight(player.Hand, 0);
  var bangleWeight = calcWeight(computer.Hand, 0);

  while(bangleWeight<17){
    sleepFor(500);
    computer.Hand.push(deck.pop());
    renderOnScreen(0);
    bangleWeight = calcWeight(computer.Hand, 0);
  }

  if (bangleWeight == playerWeight)
    EndGameMessdage('TIES');
  else if(playerWeight==21 || bangleWeight > 21 ||  bangleWeight < playerWeight)
    EndGameMessdage('WINNER');
  else if(bangleWeight > playerWeight)
    EndGameMessdage('LOOSER');
}

function renderOnScreen(HideCard) {
  const fontName = "6x8";
  g.reset();  // default draw styles
  g.setFont(fontName, 1);

  g.drawString('RST', 220, 35);
  g.drawString('Hit', 60, 230);
  g.drawString('Stand', 165, 230);

  for(i=0; i<computer.Hand.length; i++){
    if(i == 1 && HideCard == 1)
      g.drawImage(card_back(), i*48, 10,{scale:0.5});
    else {
      g.drawImage(eval(computer.Hand[i].Suit+"("+computer.Hand[i].Value+")"), i*48, 10,{scale:0.5});
    }
  }
  g.setFont(fontName, 2);
  g.drawString('Dealer has '+ calcWeight(computer.Hand, HideCard)+'  ', 5, 90,true);

  for(i=0; i<player.Hand.length; i++){
    g.drawImage(eval(player.Hand[i].Suit+"("+player.Hand[i].Value+")"), i*48, 120,{scale:0.5});
  }
  g.setFont(fontName, 2);
  g.drawString('You have ' + calcWeight(player.Hand, 0)+"  ", 5, 202,true);
}

function dealHands() {
  player.Hand= [];
  computer.Hand= [];

  setTimeout(function(){
    player.Hand.push(deck.pop());
    renderOnScreen(0);
  }, 500);

  setTimeout(function(){
    computer.Hand.push(deck.pop());
    renderOnScreen(1);
  }, 1000);

  setTimeout(function(){
    player.Hand.push(deck.pop());
    renderOnScreen(1);
  }, 1500);

  setTimeout(function(){
    computer.Hand.push(deck.pop());
    renderOnScreen(1);
  }, 2000);
}

function startGame(){
  g.clear();
  deck = createDeck();
  deck = shuffle(deck);
  dealHands();
}

TC.on("touch",(p)=> {
    if (p.x<120 && p.y>120) hitMe();
    else if (p.x>120 && p.y>120) stand();
    else if (p.y<100) startGame();
});

setTimeout(startGame,500);


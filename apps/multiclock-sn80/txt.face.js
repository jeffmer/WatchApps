(() => {

  function getFace(){
  

  var W = g.getWidth();
  var H = g.getHeight();
  var scale = W/240;
  var F = 40;

  function drawTime() {    
      function convert(n){
          var t0 = [" ","one","two","three","four","five","six","seven","eight","nine"];
          var t1 = ["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
          var t20= ["twenty","thirty","forty","fifty"];
          if(n<10) return t0[n];
          if(n<20) return t1[n-10];
          if(n<60) return t20[Math.floor(n/10)-2]+(n%10!=0?"\n"+t0[n%10]:"");
          return "error";     
      }
      g.reset();
      g.clearRect(0,44,W-1,H-1);
      var d = new Date();
      g.setColor(g.theme.fg);
      g.setFontAlign(0,0);
      g.setFont("Vector",F);
      var txt = convert(d.getHours()) + "\n" + convert(d.getMinutes());
      g.drawString(txt,W/2,H/2+8);
    }


  return {init:drawTime, tick:drawTime, tickpersec:false};
  }

return getFace;

})();
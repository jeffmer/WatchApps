(() => {

  var saved = null;
  var hidewid = false;
  var Y = 0;
  
  function hide(){
    if (!Bangle.isLCDOn() || saved) return;
    saved = [];
    for (var wd of WIDGETS) {
      saved.push(wd.draw); 
      wd.draw=()=>{};
    }
    WIDGETS["viz"].draw=function(){Y=this.y;};
    g.setColor(g.theme.bg);
    Bangle.drawWidgets(Y); 
  }
  
  function reveal(){
    if (!Bangle.isLCDOn() || !saved) return;
    for (var wd of WIDGETS) wd.draw = saved.shift();
    Bangle.drawWidgets(Y); 
    saved=null;
  }
  
  function draw(){
    var img = E.toArrayBuffer(atob("GBgBAAAAAAAAAAAAAAAAAH4AAf+AB4HgDgBwHDw4OH4cMOcMYMMGYMMGMOcMOH4cHDw4DgBwB4HgAf+AAH4AAAAAAAAAAAAAAAAA"));
    g.setColor(0x07ff);
    g.drawImage(img,this.x+2,this.y,{scale:0.5});
    Y=this.y;
  }
    
  WIDGETS["viz"] ={area:"tr", width:16,draw:draw};

  TC.on('touch',(pt)=>{
    if (pt.y<60) {
      hidewid = !hidewid;
      if (hidewid) hide(); else reveal();
    }
  });    
})();

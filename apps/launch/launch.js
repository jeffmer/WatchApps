/*  Touch based - Desktop launcher
*/

var s = require("Storage");  
var w = g.getWidth();
var h = g.getHeight();

var apps = s.list(/\.info$/).map(app=>{var a=s.readJSON(app,1);return a&&{name:a.name,type:a.type,icon:a.icon,sortorder:a.sortorder,src:a.src};}).filter(app=>app && (app.type=="app" || app.type=="clock" || !app.type));
apps.sort((a,b)=>{
  var n=(0|a.sortorder)-(0|b.sortorder);
  if (n) return n; // do sortorder first
  if (a.name<b.name) return -1;
  if (a.name>b.name) return 1;
  return 0;
});

var Napps = apps.length;
var Npages = Math.ceil(Napps/6);
var maxPage = Npages-1;
var selected = -1;
var page = 0;

function draw_icon(p,n,selected) {
    var x = (n%3)*80; 
    var y = n>2?h/2:40;
    (selected?g.setColor(0.7,0.7,0.7):g.setColor(0,0,0)).fillRect(x,y,x+79,y+89);
    g.drawImage(s.read(apps[p*6+n].icon),x+10,y+10,{scale:1.25});
    g.setColor(-1).setFontAlign(0,-1,0).setFont("6x8",1).drawString(apps[p*6+n].name,x+40,y+74);
}

function drawPage(p){
    g.setColor(0,0,0).fillRect(0,0,w-1,h-1);
    g.setFont("6x8",2).setFontAlign(0,-1,0).setColor(1,1,1).drawString("ROCK-Apps ("+(p+1)+"/"+Npages+")",w/2,20);
    for (var i=0;i<6;i++) {
        if (!apps[p*6+i]) return i;
        draw_icon(p,i,false);
    }
}

TC.on("swipe",(dir)=>{
    selected = -1;
    if (dir==TC.LEFT){
        ++page; if (page>maxPage) page=maxPage;
        drawPage(page);
    } else if (dir==TC.RIGHT){
        --page; if (page<0) page=0;
        drawPage(page);
    }  
});

function isTouched(p,n){
    if (n<0 || n>5) return false;
    var x1 = (n%3)*80; var y1 = n>2?130:40;
    var x2 = x1+79; var y2 = y1+89;
    return (p.x>x1 && p.y>y1 && p.x<x2 && p.y<y2);
}

TC.on("touch",(p)=>{
    var i;
    for (i=0;i<6;i++){
        if((page*6+i)<Napps){
            if (isTouched(p,i)) {
                draw_icon(page,i,true);
                if (selected>=0) {
                    if (selected!=i){
                        draw_icon(page,selected,false);
                    } else {
                      if (D17.read()) reset(); else load(apps[page*6+i].src);
                    }
                }
                selected=i;
                break;
            }
        }
    }
    if ((i==6 || (page*6+i)>Napps) && selected>=0) {
        draw_icon(page,selected,false);
        selected=-1;
    }
});  

setTimeout(()=>{drawPage(0)},1000);

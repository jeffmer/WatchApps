(() => {

    function getFace(){

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2

    function drawRotRect(w, r1, r2, angle) {
        var w2=w/2, ll=r2-r1, theta=(angle+270)*Math.PI/180;
        g.fillPoly(g.transformVertices([0,-w2,ll,-w2,ll,w2,0,w2], 
          {x:cx+r1*Math.cos(theta),y:cy+r1*Math.sin(theta),rotate:theta}));
    }
      
    function marks(angle) {
        if (angle % 90 == 0) {
            g.setColor(g.theme.fg);
            drawRotRect(8,105,120,angle);
        } else if (angle % 30 == 0){
            g.setColor(g.theme.fg);
            drawRotRect(4,105,120,angle);
        } else {
            g.setColor(0.6,0.6,0.6);
            drawRotRect(2,110,120,angle);
        }
    }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        let hh = drawRotRect.bind(null,6,6,66);
        let mh = drawRotRect.bind(null,3,6,100);
        let sh = drawRotRect.bind(null,2,3,100);
        g.setColor(g.theme.bg);
        sh(360*secondDate.getSeconds()/60);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
            mh(360*minuteDate.getMinutes()/60);
            minuteDate = new Date();
        }
        drawDate();
        g.setColor(g.theme.fg);
        hh(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12);
        mh(360*minuteDate.getMinutes()/60);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 6);
        g.setColor(1,0,0);
        secondDate = new Date();
        sh(360*secondDate.getSeconds()/60);
        g.fillCircle(cx, cy, 3);
    }


    var buf = Graphics.createArrayBuffer(24,20,1,{msb:true});

    function initDate(){
      var date = ('0' + minuteDate.getDate()).substr(-2);
      buf.setFont("Vector",18);
      buf.setFontAlign(0,0).setColor(1).drawString(date,12,10);
    }

    function drawDate(x,y){
       g.setBgColor(-1).setColor(0);
       g.drawImage({width:24,height:20,buffer:buf.buffer},190,110);
       g.setBgColor(0).setColor(-1);
    }  


    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) {
        for (let i=0;i<60;i++)
            marks(360*i/60);
        }
        initDate(); drawDate();
        var hrs = minuteDate.getHours();
        hrs = hrs>12?hrs-12:hrs;
        Bangle.drawWidgets(hrs>=3 && hrs<9?50:166);
        onSecond(notfirst);
        return true;
    }
 
    return {init:drawAll, tick:onSecond, tickpersec:true};
 }

return getFace;

})();

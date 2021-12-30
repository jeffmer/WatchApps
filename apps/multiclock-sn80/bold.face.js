(() => {

    function getFace(){

    const p = Math.PI/2;
    const PRad = Math.PI/180;

    var cx = g.getWidth()/2;
    var cy = g.getHeight()/2;
    var scale = 1.00;

    let mark90 = Graphics.createArrayBuffer(28,12,1,{msb:true});
    mark90.fillRect(0,0,mark90.getWidth()-1, mark90.getHeight()-1);
    let mark30 = Graphics.createArrayBuffer(20,8,1,{msb:true});
    mark30.fillRect(0,0,mark30.getWidth()-1, mark30.getHeight()-1);
    let mark6 = Graphics.createArrayBuffer(10,4,1,{msb:true});
    mark6.fillRect(0,0,mark6.getWidth()-1, mark6.getHeight()-1);

    function marks(angle,r) {
        const a = angle*PRad;
        const sa = Math.sin(a);
        const ca = Math.cos(a);
        function xoff(h,w) {return cx+sa*(r-h/2+w/2)};
        function yoff(h,w) {return cy-ca*(r-h/2+w/2)};
        if (angle % 90 == 0) {
            g.setColor(g.theme.fg);
            g.drawImage(mark90.asImage(),xoff(28,12),yoff(30,12),{rotate:a+p});
        } else if (angle % 30 == 0){
            g.setColor(g.theme.fg);
            g.drawImage(mark30.asImage(),xoff(20,8),yoff(20,8),{rotate:a+p});
        } else {
            g.setColor(0.7,0.7,0.7);
            g.drawImage(mark6.asImage(),xoff(10,4),yoff(10,4),{rotate:a+p});
        }
    }

    var hour_hand = {
        width : 70, height : 8, bpp : 1,
        transparent : 0,
        buffer : E.toArrayBuffer(atob("/////////////////////////////////////////////////////////////////////////////////w=="))
      };
      var minute_hand = {
        width : 90, height : 4, bpp : 1,
        transparent : 0,
        buffer : E.toArrayBuffer(atob("/////////////////////////////////////////////////////////////////////////w=="))
      };
      var second_hand = {
        width : 95, height : 2, bpp : 1,
        transparent : 0,
        buffer : E.toArrayBuffer(atob("/////////////////////////////////////////////////////////////////////////w=="))
      };

      function hand(angle,img) { 
        const a = (angle+270)*PRad;
        const sa = Math.cos(a);
        const ca = Math.sin(a);
        const dd = (img.width-img.height)/2
        g.drawImage(img,120+sa*dd,120+ca*dd,{rotate:a});
      }

    var minuteDate;
    var secondDate;

    function onSecond(notfirst) {
        g.setColor(g.theme.bg);
        hand(360*secondDate.getSeconds()/60,second_hand);
        if (secondDate.getSeconds() === 0 || notfirst) {
            hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12,hour_hand);
            hand(360*minuteDate.getMinutes()/60,minute_hand);
            minuteDate = new Date();
        }
        g.setColor(g.theme.fg);
        hand(360*(minuteDate.getHours() + (minuteDate.getMinutes()/60))/12, hour_hand);
        hand(360*minuteDate.getMinutes()/60,minute_hand);
        g.setColor(1,0,0);
        secondDate = new Date();
        hand(360*secondDate.getSeconds()/60,second_hand);
        g.setColor(g.theme.fg);
        g.fillCircle(cx, cy, 6);
        g.setColor(g.theme.bg);
        g.fillCircle(cx, cy, 3);
    }

    function drawAll(notfirst) {
        if (!notfirst) secondDate = minuteDate = new Date();
        // draw seconds
        g.setColor(1,1,1);
        //draw bezel
        if (!notfirst) {
        for (let i=0;i<60;i++)
            marks(360*i/60, g.getWidth()/2);
        }
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

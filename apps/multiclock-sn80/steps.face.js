(() => {

    function getFace(){

        var w = g.getWidth();
        var h = g.getHeight();
        var cx = w/2;
        var cy = h/2;
        var img=require("heatshrink").decompress(atob("mEwwIGDvAEDgP+ApMD/4FVEZY1FABcP8AFDn/wAod/AocB//4AoUHAokPAokf5/8AocfAoc+j5HDvgFEvEf7+AAoP4AoJCC+E/54qCsE/wYkDn+AAos8AohZDj/AAohrEp4FEs5xEuJfDgF5Aon4GgYFBGgZOBnyJD+EeYgfgj4FEh6VD4AFDh+AAIJMCBoIFFLQQtBgYFCHIIFDjA3BC4I="));

        Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
            var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
            return this.fillPoly(this.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
                {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
        };

        function drawSteps() {
            var steps = E.totalSteps();
            g.clearRect(cx-90,cy-40,cx+90,cy+40);
            g.setColor(g.theme.fg).setFontRoboto();
            g.setFontAlign(0,0).drawString(steps,cx,cy);
            var d = Math.ceil(270*steps/10000);
            g.setColor(0,1,0);
            for (let a=0;a<d;++a) g.drawRotRect(3,110,120,a+225);
        }

        function drawBG(){
            g.setColor(0.3,0.3,0.3).fillRect(0,0,w-1,h-1);
            g.setColor(g.theme.bg).fillCircle(cx,cy,h/2-10).fillRect(0,h-36,239,h-1);
            g.setColor(g.theme.fg2).drawImage(img,cx-24,h-60);
            drawSteps();
        }

        return {init:drawBG, tick:drawSteps, tickpersec:false};
    }

    return getFace;

})();

 
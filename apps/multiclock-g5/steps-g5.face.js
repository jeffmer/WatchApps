(() => {

    function getFace(){

        var w = g.getWidth();
        var h = g.getHeight();
        var cx = w/2;
        var cy = h/2;
        var target = wOS.settings.target?wOS.settings.target:10000;
        var img=require("heatshrink").decompress(atob("mEwwIGDvAEDgP+ApMD/4FVEZY1FABcP8AFDn/wAod/AocB//4AoUHAokPAokf5/8AocfAoc+j5HDvgFEvEf7+AAoP4AoJCC+E/54qCsE/wYkDn+AAos8AohZDj/AAohrEp4FEs5xEuJfDgF5Aon4GgYFBGgZOBnyJD+EeYgfgj4FEh6VD4AFDh+AAIJMCBoIFFLQQtBgYFCHIIFDjA3BC4I="));


        Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
            var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
            return this.fillPoly(this.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
                {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
        };

        var lastd=0;

        function drawSteps() {
            var steps = E.totalSteps();
            g.clearRect(cx-180,cy-80,cx+180,cy+80);
            g.clearRect(100,h-110,185,h-20);
            g.setColor(g.theme.fg).setFontVector(100);
            g.setFontAlign(0,0).drawString(steps,cx,cy);
            var tm=Date().toString().split(' ')[4].substring(0,5);
            g.setFont("RobotoSmall").setFontAlign(-1,0).drawString(tm,100,h-70);
            g.setColor(7);
            if (steps>target){
                steps-=target;
                g.setColor(12);
            }
            var d = Math.ceil(270*steps/target);
            for (let a=lastd;a<d;++a) g.drawRotRect(6,208,228,a+225);
            lastd=d;
        }

        function drawBG(notfirst){
            if (!notfirst){     
                if (E.totalSteps()<target) g.setColor(1); else g.setColor(7);
                g.fillRect(0,0,w-1,h-1);
                g.setColor(g.theme.bg).fillCircle(cx,cy,h/2-20).fillRect(0,h-75,w-1,h-1);
                g.setColor(g.theme.fg2).drawImage(img,cx-48,h-120,{scale:2});
                g.setColor(g.theme.fg).setFont("RobotoSmall").setFontAlign(1,0).drawString(target,w-100,h-70);
                lastd=0;
            }
            Bangle.drawWidgets(100);
            drawSteps();
            return true;
        }

        return {init:drawBG, tick:drawSteps, tickpersec:false};
    }

    return getFace;

})();

 
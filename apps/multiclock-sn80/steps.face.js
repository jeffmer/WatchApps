(() => {

    function getFace(){

        var w = g.getWidth();
        var h = g.getHeight();
        var cx = w/2;
        var cy = h/2;
        var img=require("heatshrink").decompress(atob("mEwwIGDvAEDgP+ApMD/4FVEZY1FABcP8AFDn/wAod/AocB//4AoUHAokPAokf5/8AocfAoc+j5HDvgFEvEf7+AAoP4AoJCC+E/54qCsE/wYkDn+AAos8AohZDj/AAohrEp4FEs5xEuJfDgF5Aon4GgYFBGgZOBnyJD+EeYgfgj4FEh6VD4AFDh+AAIJMCBoIFFLQQtBgYFCHIIFDjA3BC4I="));
        Graphics.prototype.setFontRobotoTiny = function(scale) {
            // Actual height 10 (10 - 1)
            this.setFontCustom(atob("AAAGAAAAwB4HgOAMAAQB/BgwgIYEP+B8AAAgAwAf8P+AAAAAQA4YYcIaGZD4gQQAAccMiERDch/wIgAQA4A0ByB/w/4AQAAH2D5hIQmIT8I8AAA/A8w0ISEJ+AeCABAAgYQ4JwHgDAAAAd4bsIiGxD/gRgMAPgMyEJDNg/gPAAADGAA="), 46, atob("AwUHBwcHBwcHBwcHAw=="), 13+(scale<<8)+(1<<16));
            return this;
          };
        
        var target = wOS.settings.target?wOS.settings.target:10000;
        Graphics.prototype.drawRotRect = function(w, r1, r2, angle) {
            var w2=w/2, h=r2-r1, theta=angle*Math.PI/180;
            return this.fillPoly(this.transformVertices([-w2,0,-w2,-h,w2,-h,w2,0], 
                {x:cx+r1*Math.sin(theta),y:cy-r1*Math.cos(theta),rotate:theta}));
        };

        var lastd=0;

        function drawSteps() {
            var steps = E.totalSteps();
            g.clearRect(cx-90,cy-40,cx+90,cy+40);
            g.clearRect(50,h-50,95,h-10);
            g.setColor(g.theme.fg).setFontRoboto();
            g.setFontAlign(0,0).drawString(steps,cx,cy);
            var tm=Date().toString().split(' ')[4].substring(0,5);
            g.setFont("RobotoTiny").setFontAlign(-1,0).drawString(tm,50,h-36);
            g.setColor(0,1,0);
            if (steps>target){
                steps-=target;
                g.setColor(1,0,0);
            }
            var d = Math.ceil(270*steps/target);
            for (let a=lastd;a<d;++a) g.drawRotRect(3,110,121,a+225);
            lastd=d;
        }

        function drawBG(notfirst){
            if (!notfirst){     
                if (E.totalSteps()<target) g.setColor(0.3,0.3,0.3); else g.setColor(0,1,0);
                g.fillRect(0,0,w-1,h-1);
                g.setColor(g.theme.bg).fillCircle(cx,cy,h/2-10).fillRect(0,h-36,239,h-1);
                g.setColor(g.theme.fg2).drawImage(img,cx-24,h-60);
                g.setColor(g.theme.fg).setFont("RobotoTiny").setFontAlign(1,0).drawString(target,w-50,h-36);
                lastd=0;
            }
            Bangle.drawWidgets(50);
            drawSteps();
            return true;
        }

        return {init:drawBG, tick:drawSteps, tickpersec:false};
    }

    return getFace;

})();

 
function setTimefromPhone(menu){

function advert(){
    NRF.setAdvertising([
        0x02, //length
        0x01, //flags
        0x06, //
        0x11, //length
        0x15, //solicited Service UUID
        0xD0,0x00,0x2D,0x12,0x1E,0x4B,
        0x0F,0xA4,
        0x99,0x4E,
        0xCE,0xB5,
        0x31,0xF4,0x05,0x79],{connectable:true,discoverable:true,interval:375});
    }
    
    var state = {
        gatt:null,
        ctime:null
    };  
    
    NRF.on('connect',function(addr){
        if(NRF.getGattforCentralServer)
        do_bond(NRF.getGattforCentralServer(addr));
        else
        NRF.connect(addr).then(do_bond);
    });
            
    function do_bond(g) {
        var tval, ival;
        state.gatt = g;
        function cleanup(){
            drawIcon(0); //disconnect from iPhone
            delete state.gatt;
            delete state.ancs;
            if(!NRF.getGattforCentralServer) NRF.disconnect();
            setTimeout(()=>{NRF.wake();},500);
        }
        drawIcon(1); //connect from iPhone
        state.gatt.device.on('gattserverdisconnected', function(reason) {
            if (ival) clearInterval(ival);
            if (tval) clearInterval(tval); 
            cleanup();
        });
        E.on("kill",function(){
            state.gatt.disconnect().then(function(){NRF.sleep();});
        });      
        NRF.setSecurity({passkey:"123456",mitm:1,display:1});
        tval = setTimeout(function(){
            if (ival) clearInterval(ival);
            state.gatt.disconnect().then(cleanup);
        },10000);        
        state.gatt.startBonding().then(function(){
            ival = setInterval(function(){
                var sec = state.gatt.getSecurityStatus();
                if (!sec.connected) {clearInterval(ival); clearTimeout(tval); return;}
                if (sec.connected && sec.encrypted){
                clearInterval(ival);  
                clearTimeout(tval);
                drawIcon(2); //bonded to iPhone
                do_time(); 
                return;
                }
            },1000);
        }).catch(function(e){
            Terminal.println("ERROR "+e);
        });
    }
    
    function do_time() {
        state.ctime = {primary:null, read:null};
        state.gatt.getPrimaryService("0x1805").then(function(s) {
           state.ctime.primary=s;
           return s.getCharacteristic("0x2A2B");
        }).then(function(c) {
           state.ctime.read=c;
           drawIcon(3);//got remote time service
           return c.readValue();
        }).then (function(d){
            var dt =  new Date();
            dt.setFullYear(d.buffer[1]*256+d.buffer[0],d.buffer[2]-1,d.buffer[3]);
            dt.setHours(d.buffer[4],d.buffer[5],d.buffer[6]);
            setTime(dt.getTime()/1000);
            E.showAlert("Success!").then(()=>{E.showMenu(menu);});
        }).catch(function(e){
            g.setFont("6x8",2).drawString("ERROR "+e,20,20);
        });
    }
    
    var stage = 5;    
    //grey, pink, lightblue, yellow, green
    function draw(){
        var colors = new Uint16Array([0xc618,0xf818,0x3ff,0xffe0,0x07e0,0x0000]);
        var img = E.toArrayBuffer(atob("GBgBAAAABAAADgAAHwAAPwAAf4AAP4AAP4AAP4AAHwAAH4AAD8AAB+AAA/AAAfgAAf3gAH/4AD/8AB/+AA/8AAf4AAHwAAAgAAAA"));
        g.setColor(colors[stage]);
        g.drawImage(img,10,0);
    }
            
    function drawIcon(id){
        stage = id;
        draw();
    }
    
 
    g.clear();
    stage = 0;
    drawIcon(0);
    g.setColor(-1);
    g.setFont("Vector",24);
    g.drawString("Setting time",20,100);
    NRF.setServices(undefined,{uart:false});
    NRF.sleep();
    NRF.wake();
    advert();
}
    
    
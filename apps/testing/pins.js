var state = Int16Array(48);

function readAll(){
    for(i=0;i<48;++i) state[i] = digitalRead(i);
}

function compare(){
    for(i=0;i<48;++i) if (state[i] != digitalRead(i)) console.log("Pin ",i," ",digitalRead(i));
}
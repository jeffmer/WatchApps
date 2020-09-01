//http://www.espruino.com/BLE+Keyboard
var kb = require("ble_hid_keyboard");
NRF.setServices(undefined, { hid : kb.report });

function btnPressed() {
  // Send Enter
  kb.tap(kb.KEY.ENTER, 0, function() { });
}

// trigger btnPressed whenever the button is pressed
setWatch(btnPressed, BTN, {edge:"rising",repeat:true,debounce:50});

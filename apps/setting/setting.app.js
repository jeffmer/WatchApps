wOS.setLCDTimeout(30);
const storage = require("Storage");

var s= storage.readJSON("settings.json",1)||{ontime:5, bright:0.3, timezone:1, faceup:true};

if (storage.read("bletime.js")) eval(storage.read("bletime.js"));

function doreboot(){
  E.showPrompt("Rebooting will\nreset time.\nReboot?").then((b)=>{
      if (b) E.reboot(); else { E.showMenu(mainmenu);}
  });
}

var mainmenu = {
    "" : { "title" : "Settings" },
    'App/Widget Settings': ()=>showAppSettingsMenu(),
    "On Time" :{ value : s.ontime,
                  min:5,max:300,step:5,
                  onchange : v => { s.ontime=v;}
                },
    "Brightness" :{ value : s.bright,
                  min:0.1,max:1.0,step:0.1,
                  onchange : v => { wOS.setLCDBrightness(v); s.bright=v;}
                },
    "Time Zone" :{ value : s.timezone,
                  min:-12,max:12,step:1,
                  onchange : v => {s.timezone=v;}
                },
    'Face UP Wake': {
                  value: s.faceup,
                  format: () => (s.faceup ? 'Yes' : 'No'),
                  onchange: () => {s.faceup = !s.faceup;}
                },
    'Vibrate': {
                  value: s.vibrate,
                  format: () => (s.vibrate ? 'Yes' : 'No'),
                  onchange: () => {s.vibrate = !s.vibrate;}
                },
    'Enable GPS': {
                  value: s.gpsclient,
                  format: () => (s.gpsclient ? 'Yes' : 'No'),
                  onchange: () => {s.gpsclient = !s.gpsclient;}
                },
    'Set Time from Phone':()=>{
                  if (!setTimefromPhone) return;
                  E.showMenu();
                  setTimeout(()=>{
                    setTimefromPhone(mainmenu);
                  },300);
                },
    'Select Clock': ()=>showClockMenu(),
    'Theme': ()=>showThemeMenu(),
    'Reboot': ()=>{E.showMenu(); setTimeout(doreboot,300)},
    "Exit" : function() { storage.writeJSON("settings.json",s); Bangle.showLauncher();}
};

function showClockMenu() {
  var clockApps = require("Storage").list(/\.info$/)
    .map(app => {var a=storage.readJSON(app, 1);return (a&&a.type == "clock")?a:undefined})
    .filter(app => app) // filter out any undefined apps
    .sort((a, b) => a.sortorder - b.sortorder);
  const clockMenu = {
    '': {
      'title': 'Select Clock',
    },
    '< Back': ()=>showMainMenu(),
  };
  clockApps.forEach((app, index) => {
    var label = app.name;
    if ((!s.clock && index === 0) || (s.clock === app.src)) {
      label = "* " + label;
    }
    clockMenu[label] = () => {
      if (s.clock !== app.src) {
        s.clock = app.src;
        storage.writeJSON("settings.json",s);
        showMainMenu();
      }
    };
  });
  if (clockApps.length === 0) {
    clockMenu["No Clocks Found"] = () => { };
  }
  return E.showMenu(clockMenu);
}


function showThemeMenu() {
  function cl(x) { return g.setColor(x).getColor(); }
  function upd(th) {
    g.theme = th;
    s.theme = th;
    storage.writeJSON("settings.json",s);
    delete g.reset;
    g._reset = g.reset;
    g.reset = function(n) { return g._reset().setColor(th.fg).setBgColor(th.bg); };
    g.clear = function(n) { if (n) g.reset(); return g.clearRect(0,0,g.getWidth(),g.getHeight()); };
    g.clear(1);
    Bangle.drawWidgets();
    m.draw();
  }
  var m = E.showMenu({
    '':{title:'Theme'},
    '< Back': ()=>showMainMenu(),
    'Dark BW': ()=>{
      upd({
        fg:cl("#fff"), bg:cl("#000"),
        fg2:cl("#0ff"), bg2:cl("#000"),
        fgH:cl("#fff"), bgH:cl("#00f"),
        dark:true
      });
    },
    'Light BW': ()=>{
      upd({
        fg:cl("#000"), bg:cl("#fff"),
        fg2:cl("#00f"), bg2:cl("#0ff"),
        fgH:cl("#000"), bgH:cl("#0ff"),
        dark:false
      });
    },
    'Customize': ()=>showCustomThemeMenu(),
  });

  function showCustomThemeMenu() {
    function cv(x) { return g.setColor(x).getColor(); }
    function setT(t, v) {
      let th = g.theme;
      th[t] = v;
      if (t==="bg") {
        th['dark'] = (v===cv("#000"));
      }
      upd(th);
    }
    const rgb = {
      black: "#000", white: "#fff",
      red: "#f00", green: "#0f0", blue: "#00f",
      cyan: "#0ff", magenta: "#f0f", yellow: "#ff0",
    };
    let colors = [], names = [];
    for(const c in rgb) {
      names.push(c);
      colors.push(cv(rgb[c]));
    }
    function cn(v) {
      const i = colors.indexOf(v);
      return i!== -1 ? names[i] : v; // another color: just show value
    }
    let menu = {
      '':{title:'Custom Theme'},
      "< Back": () => showThemeMenu()
    };
    const labels = {
      fg: 'Foreground', bg: 'Background',
      fg2: 'Foreground 2', bg2: 'Background 2',
      fgH: 'Highlight FG', bgH: 'Highlight BG',
    };
    ["fg", "bg", "fg2", "bg2", "fgH", "bgH"].forEach(t => {
      menu[labels[t]] = {
          value: colors.indexOf(g.theme[t]),
          format: () => cn(g.theme[t]),
          onchange: function(v) {
            // wrap around
            if (v>=colors.length) {v = 0;}
            if (v<0) {v = colors.length-1;}
            this.value = v;
            const c = colors[v];
            // if we select the same fg and bg: set the other to the old color
            // e.g. bg=black;fg=white, user selects fg=black -> bg changes to white automatically
            // so users don't end up with a black-on-black menu
            if (t === 'fg' && g.theme.bg === c) setT('bg', g.theme.fg);
            if (t === 'bg' && g.theme.fg === c) setT('fg', g.theme.bg);
            setT(t, c);
          },
        };
    });
    menu["< Back"] = () => showThemeMenu();
    m = E.showMenu(menu);
  }
}


function showAppSettingsMenu() {
  let appmenu = {
    '': { 'title': 'App Settings' },
    '< Back': ()=>showMainMenu(),
  }
  const apps = storage.list(/\.settings\.js$/)
    .map(s => s.substr(0, s.length-12))
    .map(id => {
      const a=storage.readJSON(id+'.info',1) || {name: id};
      return {id:id,name:a.name,sortorder:a.sortorder};
    })
    .sort((a, b) => {
      const n = (0|a.sortorder)-(0|b.sortorder);
      if (n) return n; // do sortorder first
      if (a.name<b.name) return -1;
      if (a.name>b.name) return 1;
      return 0;
    })
  if (apps.length === 0) {
    appmenu['No app has settings'] = () => { };
  }
  apps.forEach(function (app) {
    appmenu[app.name] = () => { showAppSettings(app) };
  })
  E.showMenu(appmenu)
}
function showAppSettings(app) {
  const showError = msg => {
    E.showMessage(`${app.name}:\n${msg}!\n\nBTN1 to go back`);
    setWatch(showAppSettingsMenu, BTN1, { repeat: false });
  }
  let appSettings = storage.read(app.id+'.settings.js');
  try {
    appSettings = eval(appSettings);
  } catch (e) {
    console.log(`${app.name} settings error:`, e)
    return showError('Error in settings');
  }
  if (typeof appSettings !== "function") {
    return showError('Invalid settings');
  }
  try {
    // pass showAppSettingsMenu as "back" argument
    appSettings(()=>showAppSettingsMenu());
  } catch (e) {
    console.log(`${app.name} settings error:`, e)
    return showError('Error in settings');
  }
}

function showMainMenu() {E.showMenu(mainmenu);}
showMainMenu();



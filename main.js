const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

let win = null;

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  // Specify entry point
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/ornl-weather/index.html'),
    protocol: 'file',
    slashes: true
  }));

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });

  var template = [{
    label: "Application",
    submenu: [
      { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } },
      { label: "Dev Tools", accelerator: "CmdOrCtrl+I", click: function () { win.toggleDevTools(); } }
    ]
  }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  win.setMenuBarVisibility(true)
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('window-all-closed', function () {
  app.quit();
});

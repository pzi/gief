const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const menubar = require('menubar');
const path = require('path');
const Menu = require('menu');
const debug = (process.env.NODE_ENV === 'development');
const registerGlobalShortcut = require('./lib/registerGlobalShortcut');
const pkg = require('./package.json');


const mb = menubar({
  icon: __dirname + '/app/IconTemplate.png',
  preloadWindow: true,
  dir: path.join(__dirname, 'app'),
  width: 240,
  height: 500,
  resizable: false,
  'show-dock-icon': debug,
  tooltip: `${pkg.productName} ${pkg.version}`
});

mb.on('ready', () => {
  Menu.setApplicationMenu(require('./lib/menu'));

  if (debug) {
    const debugWindow = new BrowserWindow({
      width: 995,
      height: 600,
      title: 'Gief - Debug'
    });
    debugWindow.loadURL('file://' + __dirname + '/app/index.html');
    debugWindow.openDevTools();
  }

  mb.on('show', () => {
    registerGlobalShortcut('CmdOrCtrl+C', mb);
  });

  mb.on('hide', () => {
    mb.window.webContents.send('window-blur');
    globalShortcut.unregisterAll();
  });
});

mb.app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

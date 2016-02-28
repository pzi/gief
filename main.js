const debug = (process.env.NODE_ENV === 'development');
const electron = require('electron');
const app = electron.app;
app.commandLine.appendSwitch('js-flags', '--harmony');
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const menubar = require('menubar');
const path = require('path');
const Menu = require('menu');
const registerGlobalShortcut = require('./lib/registerGlobalShortcut');
const pkg = require('./package.json');

const appPath = path.join(__dirname, 'app');

const mb = menubar({
  icon: `${appPath}/IconTemplate.png`,
  preloadWindow: true,
  dir: appPath,
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
      height: 600
    });
    debugWindow.loadURL(`file://${appPath}/index.html`);
    debugWindow.openDevTools();
  }

  mb.on('show', () => {
    registerGlobalShortcut('CmdOrCtrl+C', mb);
    registerGlobalShortcut('CmdOrCtrl+F', mb);
  });

  mb.on('hide', () => {
    mb.window.webContents.send('window-blur');
    globalShortcut.unregisterAll();
  });
});

mb.app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

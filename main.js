const menubar = require('menubar');
const BrowserWindow = require('browser-window');
const path = require('path');
const debug = process.env.NODE_ENV === 'development';
const debugWindow = null;
const Menu = require('menu');
const globalShortcut = require('global-shortcut');

function registerGlobalShortCut (accelerator) {
  var ret = globalShortcut.register(accelerator, () => {
    if (debug) {
      console.log(`${accelerator} is pressed`);
    }
    mb.window.webContents.send('GlobalShortcuts', accelerator);
  });

  if (debug) {
    if (!ret) {
      console.log(`Registration of ${accelerator} failed`);
    }
    // Check whether a shortcut is registered.
    console.log('Registered:' + globalShortcut.isRegistered(accelerator));
  }
}

const mb = menubar({
  icon: __dirname + '/app/IconTemplate.png',
  preloadWindow: true,
  dir: path.join(__dirname, 'app'),
  width: 240,
  height: 500,
  resizable: false
});

mb.on('ready', () => {

  Menu.setApplicationMenu(require('./lib/menu'));

  if (debug) {
    const debugWindow = new BrowserWindow({
      width: 995,
      height: 600,
      type: 'desktop',
      frame: true
    });
    debugWindow.openDevTools();
    debugWindow.loadURL('file://' + __dirname + '/app/index.html');
  }

  mb.on('show', () => {
    registerGlobalShortCut('Command+C');
  });

  mb.on('hide', () => {
    mb.window.webContents.send('window-blur');
    globalShortcut.unregisterAll();
  });

});

mb.app.on('will-quit', function () {
  globalShortcut.unregisterAll();
});

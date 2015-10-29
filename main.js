const menubar = require('menubar');
const BrowserWindow = require('browser-window');
const path = require('path');
const debug = process.env.NODE_ENV === 'development';
const debugWindow = null;

const mb = menubar({
  icon: __dirname + '/app/Icon.png',
  preloadWindow: true,
  dir: path.join(__dirname, 'app'),
  width: 240,
  height: 500,
  resizable: false
});

mb.on('ready', () => {
  if (debug) {
    const debugWindow = new BrowserWindow({
      width  : 995,
      height : 600,
      type   : 'desktop',
      frame  : true
    });
    debugWindow.openDevTools();
    debugWindow.loadUrl('file://' + __dirname + '/app/index.html');
  }
});

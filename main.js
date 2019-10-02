const debug = process.env.NODE_ENV === 'development'
const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
app.commandLine.appendSwitch('js-flags', '--harmony')

const path = require('path')
const { menubar } = require('menubar')

const pkg = require('./package.json')
const registerGlobalShortcut = require('./lib/registerGlobalShortcut')

const appPath = path.join(__dirname, 'app')

const mb = menubar({
  icon: `${appPath}/IconTemplate.png`,
  preloadWindow: true,
  dir: appPath,
  browserWindow: {
    width: 240,
    height: 500,
    webPreferences: {
      nodeIntegration: true
      // preload: path.join(appPath, '/preload.js') // TODO: Use this insted of `nodeIntegration`
    }
  },
  resizable: false,
  'show-dock-icon': debug,
  tooltip: `${pkg.productName} ${pkg.version}`
})

mb.on('ready', () => {
  Menu.setApplicationMenu(require('./lib/menu'))

  if (debug) {
    const debugWindow = new BrowserWindow({
      width: 995,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    debugWindow.loadURL(`file://${appPath}/index.html`)
    debugWindow.openDevTools()
  }

  mb.on('show', () => {
    registerGlobalShortcut('CmdOrCtrl+C', mb)
    registerGlobalShortcut('CmdOrCtrl+F', mb)
  })

  mb.on('hide', () => {
    mb.window.webContents.send('window-blur')
    globalShortcut.unregisterAll()
  })
})

mb.app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

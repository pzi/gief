const globalShortcut = require('electron').globalShortcut;
const debug = (process.env.NODE_ENV === 'development');

/**
 * Registers keyboard shortcuts and sends them to the remote window when triggered
 */
function registerGlobalShortcut (shortcut, remote) {
  const ret = globalShortcut.register(shortcut, () => {
    if (debug) {
      console.info(`${shortcut} is pressed`);
    }
    remote.window.webContents.send('GlobalShortcuts', shortcut);
  });

  if (debug) {
    if (!ret) {
      console.warn(`Registration of ${shortcut} failed.`);
    }
    // Check whether a shortcut is registered.
    if (globalShortcut.isRegistered(shortcut)) {
      console.log(`${shortcut} was registered.`);
    }
  }
}

module.exports = registerGlobalShortcut;

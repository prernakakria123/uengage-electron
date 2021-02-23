require('update-electron-app')()
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
let mainWindow;

// setInterval(() => {
//   console.log("checking..");
//   mainWindow.webContents.send('checking');
//   autoUpdater.checkForUpdates()
// }, 60000)
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  //   mainWindow.once('ready-to-show', () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
}

app.on('ready', () => {
  createWindow();
});
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//   }

//   dialog.showMessageBox(dialogOpts).then((returnValue) => {
//     if (returnValue.response === 0) autoUpdater.quitAndInstall()
//   })
// })
autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})
// autoUpdater.setFeedURL({
//   "provider": "github",
//   "url":"https://github.com/prernakakria123/uengage-electron.git",
//   "owner": "prerna",
//   "repo": "uengage-electron"
// });

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
// autoUpdater.on('checking-for-update', () => {
//   console.log("checking for updates");
// })
// autoUpdater.on('update-available', () => {
//   console.log("Update Available");
//   mainWindow.webContents.send('update_available');
// });

// autoUpdater.on('error', (err) => {
//   console.log('Error in auto-updater. ' + err);
// })
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });
// ipcMain.on('restart_app', () => {
//   autoUpdater.quitAndInstall();
// });
autoUpdater.on('checking-for-update', () => {
  sendStatus('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatus('Update available.');
  log.info('info', info);
  log.info('arguments', arguments);
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatus('Update not available.');
  log.info('info', info);
  log.info('arguments', arguments);
})
autoUpdater.on('error', (ev, err) => {
  sendStatus('Error in auto-updater.');
  log.info('err', err);
  log.info('arguments', arguments);
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatus('Update downloaded.  Will quit and install in 5 seconds.');
  log.info('info', info);
  log.info('arguments', arguments);
  // Wait 5 seconds, then quit and install
  // setTimeout(function() {
  //   autoUpdater.quitAndInstall();  
  // }, 5000)
})
// Wait a second for the window to exist before checking for updates.
//autoUpdater.setFeedURL('http://127.0.0.1:8080/');
setTimeout(function() {
  log.info('starting update check');
  autoUpdater.checkForUpdates()  
}, 1000);

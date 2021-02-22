require('update-electron-app')()
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
let mainWindow;
autoUpdater.setFeedURL({
  "provider": "github",
  "owner": "prerna",
  "repo": "uengage-electron",
  "token": "666df9e470055479eea966fb697e60e0a7d67ebe"
});
setInterval(() => {
  console.log("checking..");
  mainWindow.webContents.send('checking');
  autoUpdater.checkForUpdates()
}, 60000)
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
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})
autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
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

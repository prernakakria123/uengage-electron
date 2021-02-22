require('update-electron-app')()
const { app, BrowserWindow, ipcMain,autoUpdater,dialog } = require('electron');
const log = require('electron-log');
let mainWindow;
autoUpdater.setFeedURL({
  "provider": "github",
  "url":"https://github.com/prernakakria123/uengage-electron.git",
  "owner": "prerna",
  "repo": "uengage-electron"
});
setInterval(() => {
  console.log("checking..");
  autoUpdater.checkForUpdates()
}, 60000)
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


// ipcMain.on('app_version', (event) => {
//   event.sender.send('app_version', { version: app.getVersion() });
// });
// autoUpdater.on('checking-for-update', () => {
//   console.log("checking for updates");
// })
// autoUpdater.on('update-available', () => {
//   console.log("Update Available");
//   mainWindow.webContents.send('update_available');
// });
// autoUpdater.on('update-not-available', () => {
//   console.log("Update Not Available", info.version);
//   mainWindow.webContents.send('update_available');
// });
// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   console.log(log_message);
// })
// autoUpdater.on('error', (err) => {
//   console.log('Error in auto-updater. ' + err);
// })
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });
// ipcMain.on('restart_app', () => {
//   autoUpdater.quitAndInstall();
// });
// app.on('ready', function () {
//   autoUpdater.checkForUpdatesAndNotify();
// });
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
let mainWindow;

function createWindow () {
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
app.on("ready", () => {
  console.log("update");
	autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
autoUpdater.on('checking-for-update',()=>{
  console.log("checking for updates");
})
autoUpdater.on('update-available', () => {
  console.log("Update Available");
    mainWindow.webContents.send('update_available');
  });
  autoUpdater.on('update-not-available', () => {
    console.log("Update Not Available", info.version);
      mainWindow.webContents.send('update_available');
    });
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });
  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });
  autoUpdater.setFeedURL({
    "provider": "github",
    "owner": "prerna",
    "repo": "uengage-electron"
    });
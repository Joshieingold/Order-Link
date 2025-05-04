const {app, BrowserWindow, BrowserView} = require('electron');
const path = require('path')
const electronInstaller = require('electron-winstaller');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: './logo.png'
    })
    win.loadFile(path.join(app.getAppPath(), 'dist/index.html'))
}
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
            autoUpdater.checkForUpdatesAndNotify();
        }

    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
autoUpdater.on("update-available", () => {
    log.info("Update available.");
  });
  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded; will install on quit.");
  });
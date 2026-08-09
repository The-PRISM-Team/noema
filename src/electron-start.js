const path = require("path");
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    
    win.loadFile(path.join(__dirname, "index.html")); // use path to prevent directory shitties

    win.on('leave-full-screen', () => {
        win.maximize(); // maximize on fullscreen exit
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow(); // create window if dock icon is clicked (macOS)
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit(); // close if all windows are closed (except macOS)
});

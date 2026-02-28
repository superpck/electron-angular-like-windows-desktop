const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env['NODE_ENV'] === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:4404');
    win.webContents.openDevTools();
  } else {
    // __dirname works correctly both in dev and inside asar-packaged builds
    win.loadFile(path.join(__dirname, '..', 'dist', 'angular-desktop', 'browser', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

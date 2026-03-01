const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env['NODE_ENV'] === 'development';

// When packaged: __dirname inside asar still resolves correctly for preload
// sandbox MUST be false to allow Node.js require() in preload
function getPreloadPath() {
  return path.join(__dirname, 'preload.js');
}

// Show only the app-name menu (macOS) — hide File, Edit, View, Window, Help
// On Windows / Linux: remove the menu bar entirely
if (process.platform === 'darwin') {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
    ])
  );
} else {
  Menu.setApplicationMenu(null);
}

function createWindow() {
  const preloadPath = getPreloadPath();
  console.log('[main] preload path:', preloadPath);
  console.log('[main] preload exists:', fs.existsSync(preloadPath));
  console.log('[main] isPackaged:', app.isPackaged);
  console.log('[main] resourcesPath:', process.resourcesPath);

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: preloadPath,
    },
  });

  // Expose preload debug info to renderer via IPC
  ipcMain.handle('get-preload-debug', () => {
    const logPath = require('os').tmpdir() + '/electron-preload-debug.log';
    let logContent = '(log file not found)';
    try { logContent = fs.readFileSync(logPath, 'utf8'); } catch (_) {}
    return {
      preloadPath,
      preloadExists: fs.existsSync(preloadPath),
      isPackaged: app.isPackaged,
      resourcesPath: process.resourcesPath,
      logPath,
      logContent,
    };
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

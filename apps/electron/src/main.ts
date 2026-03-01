import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';
const SERVER_URL = process.env.GRIDVISION_URL || 'http://localhost:5173';

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    title: 'GridVision SCADA - MSEDCL',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0F172A',
    show: false,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL(SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(SERVER_URL);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'GridVision',
      submenu: [
        { label: 'About', click: () => showAbout() },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Dashboard', accelerator: 'CmdOrCtrl+1', click: () => navigate('/') },
        { label: 'SLD', accelerator: 'CmdOrCtrl+2', click: () => navigate('/sld') },
        { label: 'Alarms', accelerator: 'CmdOrCtrl+3', click: () => navigate('/alarms') },
        { label: 'Trends', accelerator: 'CmdOrCtrl+4', click: () => navigate('/trends') },
        { type: 'separator' },
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.webContents.reload() },
        { label: 'Toggle DevTools', accelerator: 'F12', click: () => mainWindow?.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Full Screen', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()) },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

function navigate(path: string): void {
  mainWindow?.webContents.executeJavaScript(`window.location.hash = '${path}'`);
}

function showAbout(): void {
  const { dialog } = require('electron');
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'About GridVision SCADA',
    message: 'GridVision SCADA v1.0.0',
    detail: 'SCADA Application for MSEDCL Smart Distribution Substations\n\nBuilt with Electron + React + TypeScript',
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// IPC handlers
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-platform', () => process.platform);

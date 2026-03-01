import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs';

export function registerIpcHandlers(): void {
  // Export data to file
  ipcMain.handle('export-data', async (_event, { data, defaultPath, filters }) => {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) return null;

    const result = await dialog.showSaveDialog(window, {
      defaultPath,
      filters: filters || [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'JSON Files', extensions: ['json'] },
      ],
    });

    if (result.canceled || !result.filePath) return null;

    fs.writeFileSync(result.filePath, data, 'utf-8');
    return result.filePath;
  });

  // Show notification
  ipcMain.handle('show-notification', (_event, { title, body }) => {
    const { Notification } = require('electron');
    new Notification({ title, body }).show();
  });
}

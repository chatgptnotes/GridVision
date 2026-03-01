import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  onNavigate: (callback: (path: string) => void) =>
    ipcRenderer.on('navigate', (_event, path) => callback(path)),
});

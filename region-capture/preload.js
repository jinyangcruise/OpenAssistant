/**
 * Region Capture - Preload Script
 * Bridge between region capture window and main process
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('regionCaptureAPI', {
  // Main → Renderer: receive screenshot data and display info
  // data: { dataUrl, screenBounds, dpr, promptHistory? }
  onCaptureStart: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('region-capture-start', handler);
    return () => ipcRenderer.removeListener('region-capture-start', handler);
  },

  // Renderer → Main: user confirmed selection with final image
  // data: { imageDataUrl, customPrompt?, promptHistory? }
  confirmRegion: (data) => {
    ipcRenderer.send('region-capture-confirm', data);
  },

  // Renderer → Main: user cancelled
  cancelRegion: () => {
    ipcRenderer.send('region-capture-cancel');
  },

  // Renderer → Main: load locale file
  getLocale: (lang) => ipcRenderer.invoke('get-locale', lang),
});

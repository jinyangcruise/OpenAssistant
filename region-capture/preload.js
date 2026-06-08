/**
 * Region Capture - Preload Script
 * Bridge between region capture window and main process
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('regionCaptureAPI', {
  // Main → Renderer: receive screenshot data and display info
  onCaptureStart: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('region-capture-start', handler);
    return () => ipcRenderer.removeListener('region-capture-start', handler);
  },

  // Renderer → Main: user confirmed selection with final image
  // data: { imageDataUrl: string, customPrompt?: string }
  confirmRegion: (data) => {
    ipcRenderer.send('region-capture-confirm', data);
  },

  // Renderer → Main: user cancelled
  cancelRegion: () => {
    ipcRenderer.send('region-capture-cancel');
  },
});

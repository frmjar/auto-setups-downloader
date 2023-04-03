const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // onUpdateTheme: (callback) => ipcRenderer.on('update-theme', callback)
  downloadSetups: () => ipcRenderer.send('download-setups'),
  downloadSetupsReply: (callback) => ipcRenderer.on('download-setups-reply', callback)
})

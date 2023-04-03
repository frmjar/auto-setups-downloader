const { app, BrowserWindow, ipcMain } = require('electron')
const { download } = require('./src/main.js')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  async function descargarSetups () {
    try {
      await download(mainWindow)
      mainWindow.webContents.send('download-setups-reply', 'Descarga finalizada')
    } catch (error) {
      mainWindow.webContents.send('download-setups-reply', 'Error al descargar')
    }
  }

  ipcMain.on('download-setups', descargarSetups)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

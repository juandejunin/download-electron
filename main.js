// main.js
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('ffmpeg-static')

// Configura la ruta de ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath)

console.log('Ruta de ffmpeg-static:', ffmpegPath)

const appDownload = require('./appDownload')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maxHeight: 800,
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('public/index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  const { app: appInstance, server } = appDownload()

  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

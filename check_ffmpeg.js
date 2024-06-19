const ffmpegPath = require('ffmpeg-static')
const { exec } = require('child_process')

console.log('Ruta de ffmpeg-static:', ffmpegPath)

exec(`${ffmpegPath} -version`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error al ejecutar ffmpeg:', error)
    return
  }
  console.log('ffmpeg versión:', stdout)
})

const path = require('path')
const fs = require('fs').promises
const youtubeDl = require('youtube-dl-exec')
const axios = require('axios')
const pathToFfmpeg = require('ffmpeg-static')
console.log('pathToFfmpeg ', pathToFfmpeg)
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(pathToFfmpeg)

const { app } = require('electron')

// Función para obtener la carpeta de descargas predeterminada del sistema
function getDefaultDownloadDir () {
  return app.getPath('downloads')
}
// Función para obtener el título limpiado
async function obtenerTituloLimpiado (videoUrl) {
  try {
    const response = await axios.get(videoUrl)
    const titleMatch = response.data.match(/<title>([^<]*)<\/title>/)

    if (titleMatch && titleMatch[1]) {
      const rawTitle = titleMatch[1]
      const cleanTitle = rawTitle.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').trim().toLowerCase()
      return cleanTitle
    } else {
      throw new Error('No se pudo encontrar el título del video.')
    }
  } catch (error) {
    console.error('Error al obtener el título del video:', error)
    throw error
  }
}

async function descargarFormato (videoUrl, cleanTitle, outputDir, formato) {
  try {
    await fs.mkdir(outputDir, { recursive: true })

    let formatoOptions
    let extension

    if (formato === 'mp3') {
      formatoOptions = {
        o: path.join(outputDir, `${cleanTitle}.webm`),
        format: 'bestaudio/best'
      }
      extension = 'mp3'
    } else {
      formatoOptions = {
        o: path.join(outputDir, `${cleanTitle}.mp4`),
        format: 'best'
      }
      extension = 'mp4'
    }

    const formatoOutput = await youtubeDl(videoUrl, formatoOptions)

    console.log(`${formato.toUpperCase()} descargado:`, formatoOutput)

    const formatoFilename = path.join(outputDir, `${cleanTitle}.${extension}`)

    // Realiza la conversión a MP3 para formatos diferentes de mp3.
    if (formato === 'mp3') {
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(path.join(outputDir, `${cleanTitle}.webm`))
          .audioCodec('libmp3lame')
          .audioBitrate(320)
          .outputOptions('-map_metadata 0')
          .toFormat('mp3')
          .on('end', async () => {
            console.log('Conversión a MP3 exitosa.')
            // Eliminar el archivo .webm después de la conversión
            try {
              await fs.unlink(path.join(outputDir, `${cleanTitle}.webm`))
              console.log('Archivo .webm eliminado.')
            } catch (err) {
              console.error('Error al eliminar el archivo .webm:', err)
            }
            resolve()
          })
          .on('error', (err) => {
            console.error('Error en la conversión a MP3: ' + err)
            reject(err)
          })
          .save(formatoFilename)
      })
    }

    return `${cleanTitle}.${extension}`
  } catch (error) {
    console.error(`Error al descargar y convertir el ${formato}:`, error)
    throw error
  }
}

module.exports = {
  getDefaultDownloadDir,
  obtenerTituloLimpiado,
  descargarFormato
}

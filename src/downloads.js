const axios = require('axios')
const fs = require('fs')
const { PATH_DEFAULT, PATH_IRACING, ELEMAO } = require('../utils/constantes.js')

const download = async (url, seriePath, headers) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers,
      responseType: 'stream'
    })

    const setupName = response.headers['content-disposition']?.split('"')[1]
    const regexSubcarpeta = /(?:.*_)([A-Za-z0-9]+_[0-9]{2}[A-Za-z0-9]{2}(_W[0-9])?)/
    let subcarpeta = setupName.match(regexSubcarpeta)[1]
    const temporada = subcarpeta.split('_')[1]
    subcarpeta = subcarpeta.split('_')[0] + '_' + subcarpeta.split('_')[2]

    const setupPath = `${seriePath}${temporada}/${subcarpeta}`
    if (!fs.existsSync(setupPath)) {
      fs.mkdirSync(setupPath, { recursive: true })
    }

    return new Promise((resolve, reject) => {
      const w = response.data.pipe(fs.createWriteStream(`${setupPath}/${setupName}`))
      w.on('finish', () => {
        return resolve(`Successfully downloaded file! - ${setupName}`)
      })
      w.on('error', (err) => {
        return reject('Error downloading file!', err)
      })
    })
  } catch (err) {
    return Promise.reject(`Error al descargar setup: ${url}`, err)
  }
}

const descargarSetup = async (url, serie, mapeo, headers, mainWindow) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers
    })
    mainWindow.webContents.send('download-setups-reply', ELEMAO)
    const enlaces = response.data.matchAll(/<a href='https:\/\/(.*)' {2}class='avia-button (.*) Setup<\/span>/g)
    const enlacesSetups = [...enlaces].map((enlace) => enlace[1]).filter((enlace) => !enlace.includes('choose-package'))
    let seriePath = `${PATH_DEFAULT}${serie}/`

    const iracing = mapeo[serie]
    if (iracing) {
      let serieIracing = serie
      if (iracing.serie) {
        serieIracing = iracing.serie
      } else if (iracing.serie === '') {
        serieIracing = ''
      }

      seriePath = `${PATH_IRACING}${iracing.coche}/${serieIracing}/`
    }

    return Promise.allSettled(enlacesSetups.map(url =>
      download(`https://${url}`, seriePath, headers, mainWindow)
        .then((value) => {
          mainWindow.webContents.send('download-setups-reply', value)
          return Promise.resolve()
        })
        .catch((value, error) => {
          console.error(value)
          mainWindow.webContents.send('download-setups-reply', value)
          return Promise.reject(error)
        })
    ))
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = {
  descargarSetup
}

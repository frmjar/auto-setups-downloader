import axios from 'axios'
import fs from 'fs'
import { PATH_DEFAULT, PATH_IRACING } from '../utils/constantes.js'

const download = async (url, seriePath, headers) => {
  const response = await axios.get(url, {
    withCredentials: true,
    headers,
    responseType: 'stream'
  })

  return new Promise((resolve, reject) => {
    const setupName = response.headers['content-disposition']?.split('"')[1]
    const regexSubcarpeta = /(?:.*_)([A-Za-z0-9]+_[0-9]{2}[A-Za-z0-9]{2}(_W[0-9])?)/
    let subcarpeta = setupName.match(regexSubcarpeta)[1]
    const temporada = subcarpeta.split('_')[1]
    subcarpeta = subcarpeta.split('_')[0] + '_' + subcarpeta.split('_')[2]

    const setupPath = `${seriePath}${temporada}/${subcarpeta}`
    if (!fs.existsSync(setupPath)) {
      fs.mkdirSync(setupPath, { recursive: true })
    }

    const w = response.data.pipe(fs.createWriteStream(`${setupPath}/${setupName}`))
    w.on('finish', () => {
      console.log('Successfully downloaded file! - ', setupName)
      return resolve()
    })
    w.on('error', (err) => {
      console.log('Error downloading file!')
      return reject(err)
    })
  })
}

const descargarSetup = async (url, serie, mapeo, headers) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers
    })

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

    return Promise.all(enlacesSetups.map(url => download(`https://${url}`, seriePath, headers)))
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  descargarSetup
}

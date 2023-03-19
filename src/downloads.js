import axios from 'axios'
import fs from 'fs'
import { PATH_DEFAULT } from '../utils/constantes.js'

const download = async (url, path, headers) => {
  const response = await axios.get(url, {
    withCredentials: true,
    headers,
    responseType: 'stream'
  })

  return new Promise((resolve, reject) => {
    const setupName = response.headers['content-disposition']?.split('"')[1]
    const regex2 = /(?:.*_)([A-Za-z0-9]+_[0-9]{2}[A-Za-z0-9]{2}(_W[0-9])?)/
    const subcarpeta = setupName.match(regex2)[1]

    const setupPath = `${path}${subcarpeta}`
    if (!fs.existsSync(setupPath)) {
      fs.mkdirSync(setupPath, { recursive: true })
    }
    const w = response.data.pipe(fs.createWriteStream(`${setupPath}/${setupName}`))
    w.on('finish', () => {
      // console.log('Successfully downloaded file! - ', setupName)
      return resolve()
    })
    w.on('error', (err) => {
      console.log('Error downloading file!')
      return reject(err)
    })
  })
}

const descargarSetup = async (url, carpeta, headers) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers
    })

    const enlaces = response.data.matchAll(/<a href='https:\/\/(.*)' {2}class='avia-button (.*) Setup<\/span>/g)
    const enlacesSetups = [...enlaces].map((enlace) => enlace[1]).filter((enlace) => !enlace.includes('choose-package'))

    return Promise.all(enlacesSetups.map(url => download(`https://${url}`, `${PATH_DEFAULT}${carpeta}/`, headers)))
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  descargarSetup
}

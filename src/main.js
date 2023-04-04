const axios = require('axios')
const { getTokens, headers, login, logout } = require('./credentials.js')
const { descargarSetup } = require('./downloads.js')
const mapeo = require('../utils/mapeo.json')

const ROOTURL = 'https://puredrivingschool.com/membersite/'

const getSetupsLinks = async (url, headers) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers
    })

    const links = response.data.matchAll(/<a href=["|']https:\/\/puredrivingschool.com\/membersite\/setup\/\?id=(.){2,30}["|']/g)
    const setupsLinks = [...links].map((enlace) => enlace[0].match(/href=(.*) [target|class]/)[1].replace(/["|']/g, ''))
    return setupsLinks
  } catch (error) {
    return Promise.reject(error)
  }
}

const download = async (mainWindow) => {
  try {
    const { PHPSESSID, redirectToValue } = await getTokens()
    const WORDPRESSLogged = await login(PHPSESSID, redirectToValue)
    // eslint-disable-next-line no-var
    var header = headers(PHPSESSID, WORDPRESSLogged)

    const setupsLinks = await getSetupsLinks(ROOTURL, header)

    await Promise.allSettled(setupsLinks.map(async url => {
      const carpeta = url.split('=')[1]
      return descargarSetup(url, carpeta, mapeo, header, mainWindow).then(() => {
        mainWindow.webContents.send('download-setups-reply', `Descargada serie: ${carpeta}`)
        return Promise.resolve()
      }).catch((error) => {
        console.error(`Error al descargar serie: ${carpeta}`)
        mainWindow.webContents.send('download-setups-reply', `Error al descargar serie: ${carpeta}`)
        return Promise.reject(error)
      })
    }))

    return logout(header)
  } catch (error) {
    console.error(error)
    await logout(header)
  }
}

module.exports = {
  download
}

import axios from 'axios'
import { getTokens, headers, login, logout } from './credentials.js'
import { descargarSetup } from './downloads.js'
import mapeo from '../utils/mapeo.json' assert { type: "json" }

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

const download = async () => {
  try {
    const { PHPSESSID, redirectToValue } = await getTokens()
    const WORDPRESSLogged = await login(PHPSESSID, redirectToValue)
    // eslint-disable-next-line no-var
    var header = headers(PHPSESSID, WORDPRESSLogged)

    const setupsLinks = await getSetupsLinks(ROOTURL, header)

    await Promise.all(setupsLinks.map(async url => {
      const carpeta = url.split('=')[1]
      return descargarSetup(url, carpeta, mapeo, header).then((res) => {
        console.log(`Descargada serie: ${carpeta}`)
        return Promise.resolve()
      }).catch((error) => {
        console.log(`Error al descargar serie: ${carpeta}`)
        return Promise.reject(error)
      })
    }))

    return await logout(header)
  } catch (error) {
    console.log(error)
    await logout(header)
  }
}

download().then((res) => {
  console.log('Terminado con exito rotundo elemao')
}
).catch((error) => {
  console.log(error)
})

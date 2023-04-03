const axios = require('axios')
const FormData = require('form-data')
const { USER, PASS } = require('../utils/constantes.js')

const ROOTURL = 'https://puredrivingschool.com/membersite/'
const LOGINURL = 'https://puredrivingschool.com/wp-admin/admin-ajax.php'

const getPHPSESSID = (header) => header['set-cookie'][0].split(';')[0].split('=')[1]
const getWORDPRESSID = (header) => header['set-cookie'][2].split(';')[0]

const getTokens = async () => {
  try {
    const response = await axios.get(ROOTURL, { withCredentials: true })
    const respuesta = response.data
    const header = response.headers
    const redirectTo = respuesta.match('<input type="hidden" name="redirect_to" value="(.*)" />')[0]
    const redirectToValue = redirectTo.match('value="(.*)"')[1]
    const PHPSESSID = getPHPSESSID(header)
    return { redirectToValue, PHPSESSID }
  } catch (error) {
    return Promise.reject({
      code: error.response.status,
      message: error.response.statusText
    })
  }
}

const headers = (PHPSESSID, WORDPRESSLogged) => {
  return {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Cookie: `PHPSESSID=${PHPSESSID}; ${WORDPRESSLogged}`,
    Connection: 'keep-alive'
  }
}

const login = async (PHPSESSID, redirectToValue) => {
  const formData = new FormData()
  formData.append('user_login', USER)
  formData.append('user_password', PASS)
  formData.append('action', 'sidebar_login_process')
  formData.append('remember', 'forever')
  formData.append('redirect_to', redirectToValue)

  const headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'content-type': formData.getHeaders()['content-type'],
    Cookie: `PHPSESSID=${PHPSESSID}`,
    Connection: 'keep-alive'
  }

  const response = await axios.post(LOGINURL, formData, {
    withCredentials: true,
    maxRedirects: 0,
    headers
  })

  if (response.data.error) throw new Error(response.data.error)
  return getWORDPRESSID(response.headers)
}

const logout = async (headers) => {
  try {
    const response = await axios.get(ROOTURL, {
      withCredentials: true,
      headers
    })

    const logoutURL = response.data.match('<li class="logout-link">(.*)')[0].match('href="(.*)">Logout')[1]

    return axios.get(logoutURL, {
      withCredentials: true,
      headers
    }).then(() => {
      console.log('Logout')
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = {
  getTokens,
  headers,
  login,
  logout
}

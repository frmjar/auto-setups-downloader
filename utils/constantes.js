const dotenv = require('dotenv');
dotenv.config()

const PASS = process.env.PASSWORD_PURE || 'PASSWORD-HERE'
const USER = process.env.USERNAME_PURE || 'USER-HERE'
const PATH_DEFAULT = process.env.PATH_DOWNLOAD_DEFAULT || 'PATH-TO-DOWNLOAD-HERE'
const PATH_IRACING = process.env.PATH_DOWNLOAD_IRACING || 'PATH-IRACING-HERE'

module.exports = {
  USER,
  PASS,
  PATH_DEFAULT,
  PATH_IRACING
}

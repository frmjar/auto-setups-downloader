import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const PASS = process.env.PASSWORD || 'PASSWORD-HERE'
const USER = process.env.USERNAME || 'USER-HERE'
const PATH = process.env.PATH_DOWNLOAD || 'PATH-TO-DOWNLOAD-HERE'

export {
  USER,
  PASS,
  PATH
}

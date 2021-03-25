import dotenv from 'dotenv'

dotenv.config()

let MONGO_URL

if (process.env.NODE_ENV === 'production') {
  MONGO_URL = '추후입력'
} else {
  MONGO_URL = process.env.MONGO_DEV
}

export default {
  MONGO_URL,
  PORT: process.env.PORT
}

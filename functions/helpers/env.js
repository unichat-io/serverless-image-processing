if (process.env.NODE_ENV === 'development') {
  const path = require('path')

  require('dotenv').config({
    path: path.resolve(process.cwd(), './secrets/.env.local')
  })
}

const { BUCKET } = process.env

if (!BUCKET) throw new Error('Bucket Not Provided')

module.exports = {
  BUCKET
}

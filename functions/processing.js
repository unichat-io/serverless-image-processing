const preprocess = require('./helpers/preprocess')
const { getS3 } = require('./helpers/s3')

module.exports.handler = async (event, context, callback) => {
  try {
    if (!event.queryStringParameters) throw new Error('Needs Query String Parameters')

    const f = event.queryStringParameters.f || ''
    const q = Math.abs(event.queryStringParameters.q) || 100
    const t = event.queryStringParameters.t || 'webp'

    const size = {
      w: Math.abs(event.queryStringParameters.w) || null,
      h: Math.abs(event.queryStringParameters.h) || null
    }

    const file = await getS3(f)

    const processed = await preprocess(file.image, size, q, t)

    const buffer = Buffer.from(processed.image.buffer, 'base46')

    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': processed.contentType,
        'Access-Control-Allow-Origin': '*'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    })
  } catch (err) {
    console.error(err)
    callback(null, err)
  }
}

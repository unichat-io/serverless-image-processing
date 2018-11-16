const query = require('micro-query')

const preprocess = require('./functions/helpers/preprocess')
const { getS3 } = require('./functions/helpers/s3')

const Processing = async (req, res) => {
  try {
    const parsed = query(req)

    if (!Object.keys(parsed).length) throw new Error('Needs Query String Parameters')

    const f = parsed.f || ''
    const q = Math.abs(parsed.q) || 100
    const t = parsed.t || 'webp'

    const size = {
      w: Math.abs(parsed.w) || null,
      h: Math.abs(parsed.h) || null
    }

    const file = await getS3(f)

    const processed = await preprocess(file.image, size, q, t)

    const buffer = Buffer.from(processed.image.buffer, 'base46')

    res.writeHead(200, {
      'Content-Type': processed.contentType
    })

    res.end(buffer)
  } catch (err) {
    console.log(err)
    res.end(err.message || err)
  }
}

module.exports = Processing

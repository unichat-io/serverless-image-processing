const aws = require('aws-sdk')
const { BUCKET } = require('./env')

aws.config.update({
  'bucketname': BUCKET
})

// Set AWS to use native promises
aws.config.setPromisesDependency(null)

const s3 = new aws.S3()

const getS3 = async (fileName) => {
  const params = {
    Bucket: BUCKET,
    Key: fileName
  }

  try {
    // Check if Key exist
    await s3.headObject({
      Bucket: params.Bucket,
      Key: params.Key
    }).promise()

    // Get image from S3
    const data = await s3.getObject({
      Bucket: params.Bucket,
      Key: params.Key
    }).promise()

    const contentType = data.ContentType
    const image = data.Body

    return { image, contentType }
  } catch (err) {
    if (err.statusCode === 404) {
      throw new Error(404, 'Not Found')
    } else {
      throw err
    }
  }
}

module.exports = {
  getS3
}

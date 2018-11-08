const Sharp = require('sharp');

const Types = require('./utils/types');
const ImageFetcher = require('./utils/s3-image-fetcher');
const ImageProcessing = require('./utils/image-process');

module.exports.handler = (event, context, callback) => {
  const imageFetcher = new ImageFetcher(process.env.BUCKET);
  const imageProcessing = new ImageProcessing(Types, Sharp);

  const fileName = event.queryStringParameters && event.queryStringParameters.f;
  const quality = event.queryStringParameters && +event.queryStringParameters.q || 100;
  const type = event.queryStringParameters && event.queryStringParameters.t;

  const size = {
    w: event && +event.queryStringParameters.w || null,
    h: event && +event.queryStringParameters.h || null
  };

  return imageFetcher.fetchImage(fileName)
    .then(data => imageProcessing.exec(data.image, size, quality, type))
    .then(data => {
      const contentType = data.contentType;
      const img = new Buffer(data.image.buffer, 'base64');

      callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': contentType },
        body: img.toString('base64'),
        isBase64Encoded: true,
      });
    })
    .catch(error => {
      console.error('Error:', error);
      callback(null, error);
    });
};

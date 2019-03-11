const fs = require('fs')
const path = require('path')
const Jimp = require('jimp')
const walk = require('./lib/walk.js')
const utils = require('./lib/utils.js')
const argv = require('yargs-parser')(process.argv.slice(2))

const breakpoints = [
  576, //sm
  768, //md
  992, //lg
  1200, //xl
]
const options = {
  dir: path.resolve('images'),
  dest: path.resolve('build'),
  skipSmaller: false,
  quality: 75,
  ...argv,
}
options.dir = path.resolve(__dirname, options.dir)

try {
  fs.lstatSync(options.dir)
} catch (err) {
  console.error(`Error: no such file or directory ${options.dir}`)
  process.exit(1)
}

walk(options.dir, (err, files) => {
  if (err) throw err;

  const images = files.filter(utils.isImage)
  images.map(async image => {
    options.path = path.join(options.dest, image.substring(__dirname.length - 1))
    breakpoints.map(async width => await resize(image, width, options))
  })
})

const resize = async (imagePath, desiredWidth, options) => {
  const writePath = options.path
  return Jimp.read(imagePath)
    .then(image => {
      if (image.getWidth() <= desiredWidth) {
        if (options.skipSmaller) {
          return
        }
        desiredWidth = image.getWidth()
      }

      utils.markProgress()
      return image
        .resize(desiredWidth, Jimp.AUTO)
        .quality(options.quality)
        .writeAsync(utils.uniquePath(writePath, desiredWidth))
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

const fs = require('fs')
const path = require('path')
const Jimp = require('jimp')
const walk = require('./lib/walk.js')
const argv = require('yargs-parser')(process.argv.slice(2))

const options = {
  dir: path.resolve('images'),
  dest: path.resolve('build'),
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

  let items = 0
  const images = files.filter(isImage)
  images.map(async image => {
    await optimize(image, options.quality, path.join(options.dest, image.substring(__dirname.length - 1)))

    items++
    if (images.length > 0 && items === images.length) {
      done()
    }
  })
})

const optimize = async (image, quality, destination) => {
  return Jimp.read(image)
    .then(optimized => {
      return optimized
        .quality(quality)
        .writeAsync(destination)
    })
    .catch(err => {
      console.error(err)
    })
}

const done = () => console.log('👍')
const isImage = (file) => new RegExp('.+(jpe?g|png|gif)', 'gi').test(file)

const imageSize = (image, cb) => {
  fs.stat(image, (err, stats) => {
    if (err) return cb(err)
    cb(null, stats.size)
  })
}

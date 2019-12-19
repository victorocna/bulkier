const fs = require("fs")
const path = require("path")
const Jimp = require("jimp")
const walk = require("./lib/walk.js")
const utils = require("./lib/utils.js")
const argv = require("yargs-parser")(process.argv.slice(2))

const options = {
  dir: path.resolve("images"),
  dest: path.resolve("build"),
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
  if (err) {
    throw err
  }

  const breakpoints = {
    576: "small",
    768: "medium",
    992: "large",
    1200: "xlarge",
    1920: "full-hd",
    3840: "ultra-4k",
  }

  const images = files.filter(utils.isImage)
  images.map(async (image) => {
    options.path = path.join(options.dest, image.substring(__dirname.length - 1))
    options.breakpoints = breakpoints

    Object.keys(breakpoints).map(async (width) => await resize(image, +width, options))
  })
})

const resize = async (imagePath, width, options) => {
  const writePath = options.path
  return Jimp.read(imagePath)
    .then((image) => {
      if (image.getWidth() <= width) {
        if (options.skipSmaller) {
          return
        }
        width = image.getWidth()
      }

      let suffix = width
      if (options.breakpoints && options.breakpoints[width]) {
        suffix = options.breakpoints[width]
      }

      utils.markProgress()
      return image
        .resize(width, Jimp.AUTO)
        .quality(options.quality)
        .writeAsync(utils.uniquePath(writePath, suffix))
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

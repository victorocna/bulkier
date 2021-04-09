const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const walk = require('./lib/walk');
const utils = require('./lib/utils');
const breakpoints = require('./breakpoints');
const config = require('./config');

const run = async () => {
  // throws if source and destination do not exist
  fs.lstatSync(config.source).isDirectory();
  fs.lstatSync(config.destination).isDirectory();

  // async read files in source folder
  for await (const file of walk(config.source)) {
    if (!utils.isImage(file)) {
      return false;
    }

    const filename = path.basename(file);
    config.path = path.join(config.destination, filename);
    config.breakpoints = breakpoints;

    for (const width of Object.keys(breakpoints)) {
      await resize(file, +width, config);
    }
  }
};
run();

const resize = async (imagePath, width, options) => {
  const writePath = options.path;
  return Jimp.read(imagePath)
    .then((image) => {
      if (image.getWidth() <= width) {
        if (options.skipSmaller) {
          return;
        }
        width = image.getWidth();
      }

      let suffix = width;
      if (options.breakpoints && options.breakpoints[width]) {
        suffix = options.breakpoints[width];
      }

      utils.markProgress();
      return image
        .resize(width, Jimp.AUTO)
        .quality(options.quality)
        .writeAsync(utils.uniquePath(writePath, suffix));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

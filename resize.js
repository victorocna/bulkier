const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const walk = require('./lib/walk.js');
const utils = require('./lib/utils.js');
const breakpoints = require('./breakpoints');
const config = require('./config');

try {
  fs.lstatSync(config.source);
} catch (err) {
  console.error(`Error: no such file or directory ${config.source}`);
  process.exit(1);
}

const run = async () => {
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

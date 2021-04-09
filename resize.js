const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const walk = require('./lib/walk.js');
const utils = require('./lib/utils.js');
const config = require('./config');

try {
  fs.lstatSync(config.source);
} catch (err) {
  console.error(`Error: no such file or directory ${config.source}`);
  process.exit(1);
}

walk(config.source, (err, files) => {
  if (err) {
    throw err;
  }

  const breakpoints = {
    576: 'small',
    768: 'medium',
    992: 'large',
    1200: 'xlarge',
    1920: 'full-hd',
    3840: 'ultra-4k',
  };

  const images = files.filter(utils.isImage);
  images.map(async (image) => {
    const filename = path.basename(image);
    config.path = path.join(config.destination, filename);
    config.breakpoints = breakpoints;

    Object.keys(breakpoints).map(async (width) => await resize(image, +width, config));
  });
});

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

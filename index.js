const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const compare = require('./lib/compare.js');
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
  if (err) throw err;

  const images = files.filter(utils.isImage);
  images.map(async (image) => {
    const filename = path.basename(image);
    const optimized = path.join(config.destination, filename);
    await optimize(image, config.quality, optimized);

    if (await compare.isWorse(image, optimized)) {
      fs.copyFile(image, optimized, (err) => {
        if (err) throw err;
      });
    }
  });
});

const optimize = async (imagePath, quality, destination) => {
  return Jimp.read(imagePath)
    .then((image) => {
      utils.markProgress();

      return image.quality(quality).writeAsync(destination);
    })
    .catch((err) => {
      console.error(err);
    });
};

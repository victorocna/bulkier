const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const compare = require('./lib/compare');
const walk = require('./lib/walk');
const utils = require('./lib/utils');
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
    const optimized = path.join(config.destination, filename);
    await optimize(file, config.quality, optimized);

    if (await compare.isWorse(file, optimized)) {
      fs.copyFile(file, optimized, (err) => {
        if (err) throw err;
      });
    }
  }
};
run();

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

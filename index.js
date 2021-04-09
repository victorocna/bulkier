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

const run = async () => {
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

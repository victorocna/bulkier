const fs = require('fs');
const path = require('path');
const slug = require('slug');
const hash = require('./lib/random-hash');
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
    const imageParts = {
      prefix: config.prefix,
      name: hash(),
    };
    const imageSlug = slug(Object.values(imageParts).join(' '), { lower: true });

    const renamed = imageSlug + path.extname(image);
    const dest = path.join(config.destination, renamed);

    fs.copyFile(image, dest, (err) => {
      if (err) throw err;
    });
  });
});

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

const run = async () => {
  for await (const file of walk(config.source)) {
    if (!utils.isImage(file)) {
      return false;
    }

    const imageParts = {
      prefix: config.prefix,
      name: hash(),
    };
    const imageSlug = slug(Object.values(imageParts).join(' '), { lower: true });

    const renamed = imageSlug + path.extname(file);
    const dest = path.join(config.destination, renamed);

    fs.copyFile(file, dest, (err) => {
      if (err) throw err;
    });
  }
};
run();

const fs = require('fs');
const path = require('path');
const slug = require('slug');
const hash = require('./lib/random-hash');
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

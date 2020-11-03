const fs = require('fs');
const path = require('path');
const slug = require('slug');
const hash = require('./lib/random-hash');
const walk = require('./lib/walk.js');
const utils = require('./lib/utils.js');
const argv = require('yargs-parser')(process.argv.slice(2));

const options = {
  dir: path.resolve('images'),
  dest: path.resolve('build'),
  prefix: '',
  ...argv,
};
options.dir = path.resolve(__dirname, options.dir);

try {
  fs.lstatSync(options.dir);
} catch (err) {
  console.error(`Error: no such file or directory ${options.dir}`);
  process.exit(1);
}

walk(options.dir, (err, files) => {
  if (err) throw err;

  const images = files.filter(utils.isImage);
  images.map(async (image) => {
    const imageParts = {
      name: hash(),
      folder: path.dirname(image).split('\\').reverse()[0],
      prefix: options.prefix,
    };
    const imageSlug = slug(Object.values(imageParts).reverse().join(' '), { lower: true });

    const renamed = imageSlug + path.extname(image);
    const dest = path.join(options.dest, renamed);

    fs.copyFile(image, dest, (err) => {
      if (err) throw err;
    });
  });
});

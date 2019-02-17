var fs = require('fs');
const path = require('path')
const Jimp = require('jimp')

/**
 * @see https://stackoverflow.com/a/5827895
 */
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

// TODO: command line options to specify directory and quality
const options = {
  src: path.resolve('test'),
  quality: 75,
}

walk(options.src, (err, files) => {
  if (err) throw err;

  let items = 0
  const images = files.filter(isImage)
  images.map(async image => {
    await optimize(image)

    items++
    if (images.length > 0 && items === images.length) {
      done()
    }
  })
})

const optimize = async (image) => {
  return Jimp.read(image)
    .then(lenna => {
      return lenna
        .quality(options.quality)
        .write(path.join('build', image.substring(__dirname.length)))
    })
    .catch(err => {
      console.error(err)
    })
}

const done = () => console.log('👍')
const isImage = (file) => new RegExp('.+(jpe?g|png|gif)', 'gi').test(file)

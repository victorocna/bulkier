const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const walk = require('./lib/walk');
const utils = require('./lib/utils');
const config = require('./config');

const run = async () => {
  // throws if source and destination do not exist
  fs.lstatSync(config.source).isDirectory();
  fs.lstatSync(config.destination).isDirectory();

  // async read files in source folder
  for await (const inputPath of walk(config.source)) {
    if (!utils.isVideo(inputPath)) {
      return false;
    }

    const filename = path.basename(inputPath);
    const extension = path.extname(filename);
    const outputPath = path.join(config.destination, filename).replace(extension, '.webm');

    // Start process and time it
    console.time();
    await optimize(inputPath, outputPath, config.bitrate);
    console.timeEnd();

    // Output file size in MB
    const stats = fs.statSync(outputPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    // Round to 2 decimal places
    console.log('File size:', fileSizeInMegabytes.toFixed(2), 'MB');
  }
};
run();

const optimize = async (inputPath, outputPath, bitrate = '1M') => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputFormat('webm')
      .videoCodec('libvpx')
      .audioCodec('libvorbis')
      .addOptions(['-vb ' + bitrate]) // Video bitrate
      .size('1280x?')
      .on('end', () => {
        console.log('Conversion to WebM finished for ' + inputPath);
        console.log('Writing to ' + outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .save(outputPath);
  });
};

require('dotenv').config();

module.exports = {
  source: process.env.SOURCE,
  destination: process.env.DESTINATION,
  prefix: process.env.PREFIX,
  quality: +process.env.QUALITY,
};

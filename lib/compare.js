const fs = require("fs")

const filesize = (file) => {
  return new Promise((resolve, reject) => {
    fs.lstat(file, (err, stat) => {
      if (err) return reject(err)
      resolve(stat.size)
    })
  })
}

const compare = {
  isBetter: async (x, y) => {
    return (await filesize(x)) > (await filesize(y))
  },
  isWorse: async (x, y) => {
    return (await filesize(x)) < (await filesize(y))
  },
}

module.exports = compare

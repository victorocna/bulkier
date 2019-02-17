const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const fileToWatch = path.resolve(__dirname, 'index.js')

// TODO: add option to provide input file from CLI
// TODO: dev/README.md
if (! fs.existsSync(fileToWatch)) {
  throw new Error('file missing')
}

fs.watchFile(fileToWatch, () => {
  console.log('reloading...')
  exec(`node ${fileToWatch}`, (err, stdout) => {
    if (err) throw err
    console.log(stdout)
  })
})

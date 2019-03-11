/**
 * Works like a loading gif
 */
module.exports.markProgress = () => process.stdout.write('.')

/**
 * Is the file an image?
 * @param {string} file
 */
module.exports.isImage = (file) => new RegExp('.+(jpe?g|png|gif)', 'gi').test(file)

/**
 * Appends a suffix to a path
 * @param {string} path
 * @param {string} suffix
 */
module.exports.uniquePath = (path, suffix) => path.replace(/(\.[\w\d_-]+)$/i, `-${suffix}$1`)

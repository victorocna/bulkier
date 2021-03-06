const { resolve } = require('path');
const { readdir } = require('fs').promises;

/**
 * @see https://stackoverflow.com/a/45130990
 */
async function* walk(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

module.exports = walk;

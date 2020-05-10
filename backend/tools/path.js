var crypto = require('crypto');

/**
 * Creates a random name to be use as a temporary filename.
 *
 * @return {String} A random file name with 'temp' prefix.
 */
exports.get_temp_filename = function () {
  return 'temp-' + crypto.randomBytes(4).readUInt32LE(0);
};

/**
 * Creates a name for the minified version of a .js bundle file, e.g. hello.js -> hello.min.js.
 *
 * @param {String} filename Original filename.
 * @return {String} Filename for the minified version of given file.
 */
exports.getMinifiedFilename = function (filename) {
  if (typeof filename !== 'string' || filename.length === 0) {
    throw new Error('Given filename is not valid');
  }

  // Find last dot and then replace it with '.min.'
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex < 0) {
    throw new Error('Given filename does not have an extension');
  }

  return filename.substr(0, lastDotIndex) + '.min.' + filename.substr(lastDotIndex + 1);
};

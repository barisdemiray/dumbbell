var crypto = require('crypto');
var path = require('path');
var os = require('os');

/**
 * Creates a random name to be use as a temporary filename.
 *
 * @return {String} A random file name with 'temp' prefix.
 */
exports.getTempFilename = function () {
  return 'temp-' + crypto.randomBytes(4).readUInt32LE(0);
};

/**
 * Returns the path to a temporary folder in OS' temp directory.
 * @return {String} Path to a temp folder.
 * @todo Name is a bit confusing, as it's not returning the temp directory of the OS.
 */
exports.getTempFolderPath = function () {
  return path.join(os.tmpdir(), this.getTempFilename());
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

/**
 * Returns path to package folder in node_modules given the project path.
 * i.e. returns /tmp/project/node_modules/package/.
 *
 * @param {String} packageName Name of the NPM package.
 * @param {String} projectPath Path of the project where this package has been installed.
 */
exports.getModuleInstallationPath = function (packageName, projectPath) {
  return path.join(projectPath, 'node_modules', packageName);
};

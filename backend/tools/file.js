const execa = require('execa');
const fs = require('fs');

/**
 * Gzips given file at given path and returns the path to this gzipped version.
 *
 * @param {String} fileDir Directory in which the file is found.
 * @param {String} filename Name of the file.
 * @return {String} Path to the gzipped file on success, null otherwise.
 */
exports.gzipFile = async function (fileDir, filename) {
  // Prepare the filename to be returned if all goes well
  const gzippedFilename = filename + '.gz';
  const args = ['--keep', filename];
  const opts = {
    cwd: fileDir,
  };

  try {
    // todo check if webpack is in the path
    const { stdout, stderr } = await execa('gzip', args, opts);

    return gzippedFilename;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Returns size of the file at given path in bytes.
 *
 * @param {String} filePath Path of the file.
 * @return {Number} Size of given file in bytes or -1 on error.
 */
exports.getFileSizeInBytes = function (filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot find file ${filePath}`);
    }

    // Get the file size of the minified and gzipped output
    let stats = fs.statSync(filePath);
    let sizeInBytes = stats['size'];

    return sizeInBytes;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

const execa = require('execa');
const fs = require('fs');
const del = require('del');

/**
 * Gzips given file at given path and returns the path to this gzipped version.
 *
 * @param {String} filePath Path to the file to be gzipped, relative to second parameter. Note that original file is kept.
 * @param {String} fileDirectory Path to the folder where the file is found. Mostly serves as the working directory.
 * @return {String} Path to the gzipped file (again relative to given folder path) on success, null otherwise.
 */
exports.gzipFile = async function (filePath, fileDirectory) {
  // Prepare the filename to be returned if all goes well
  const gzippedFilePath = filePath + '.gz';
  const args = ['--keep', filePath];
  const opts = { cwd: fileDirectory };

  try {
    console.info('args gzipFile', args);
    console.info('opts gzipFile', opts);

    const { stdout, stderr } = await execa('gzip', args, opts);

    return gzippedFilePath;
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

/**
 * Removes given folder with all its contents.
 *
 * @param {String} Full path to the directory to be removed.
 * @return {Boolean} true on success, false otherwise.
 */
exports.removeFolder = async function (folderPath) {
  // Pass force here (oh how much I don't like force in programming lexical) as we're removing
  // most often a directory under the temp folder of the OS, which falls outside of the current
  // working directory.
  await del(folderPath, { force: true });
};

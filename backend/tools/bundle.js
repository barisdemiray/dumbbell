const execa = require('execa');
const path = require('path');
const fs = require('fs');

const PathTools = require('./path');
const FileTools = require('./file');
const PackageTools = require('./package');

/**
 * Bundles given package installed in node_modules in a very very primitive way.
 *
 * @param {String} packageName Name of the package.
 * @param {String} modulesFolderPath Path to node_modules folder in which the package has been installed.
 * @return {String} Name of the bundle file.
 */
exports.bundlePackage = async function (packageName, modulesFolderPath) {
  try {
    // First find the entry point of this package in its package.json
    const packageEntryPoint = await PackageTools.getPackageEntryPoint(
      packageName,
      modulesFolderPath
    );

    const bundleFilename = PathTools.getTempFilename() + '.js';
    const args = [packageEntryPoint, '--output-filename', bundleFilename];

    // todo check return values of spawned processes
    // todo check if webpack is in the path
    const opts = { cwd: path.join(modulesFolderPath, packageName) };

    console.debug('args bundle_package', args);
    console.debug('opts bundle_package', opts);

    const { stdout, stderr } = await execa('webpack', args, opts);

    return bundleFilename;
  } catch (error) {
    console.error('error', error);
    throw Error('Failed to bundle package: ' + error);
  }
};

/**
 * Minifies given bundle file using 'minify'.
 *
 * @param {String} bundleFileDir Directory in which bundle file is located.
 * @param {String} bundleFilename Name of the bundle file.
 * @todo Look for better minifiers.
 * @return {String} Name of the minified bundle file.
 */
exports.minifyBundleFile = async function (bundleFileDir, bundleFilename) {
  // Create a filename for the minified version, e.g. 91239128391.js -> 91239128391.min.js
  const minifiedBundleFilename = PathTools.getMinifiedFilename(bundleFilename);
  const args = [bundleFilename, '-o', minifiedBundleFilename];
  const opts = { cwd: bundleFileDir };

  try {
    // todo check if minify is in the path

    console.debug('args minifyBundleFile', args);
    console.debug('opts minifyBundleFile', opts);

    const { stdout, stderr } = await execa('minify', args, opts);

    return minifiedBundleFilename;
  } catch (error) {
    console.error('error', error);
    throw Error('Failed to minify bundle: ' + error);
  }
};

/**
 * Princial entry point for collecting bundle info. It minifies and gzips and then queries file size.
 *
 * @param {String} packageName Name of the package to be evaluated.
 * @param {String} modulesFolderPath Path to node_modules folder in which the package has been installed.
 * @return {Object} An object with 'size' property indicating size in bytes of the bundle.
 */
exports.getBundleSizeInfo = async function (packageName, modulesFolderPath) {
  try {
    const bundleFileDir = path.join(modulesFolderPath, packageName);

    const bundleFilename = await this.bundlePackage(packageName, modulesFolderPath);
    console.debug('bundleFilename', bundleFilename);

    const minifiedBundleFilename = await this.minifyBundleFile(bundleFileDir, bundleFilename);
    console.debug('minifiedBundleFilename', minifiedBundleFilename);

    const gzippedAndMinifiedBundleFilename = await FileTools.gzipFile(
      bundleFileDir,
      minifiedBundleFilename
    );
    console.debug('gzippedAndMinifiedBundleFilename', gzippedAndMinifiedBundleFilename);

    // Report size of bundle size, minified bundle size and finally minified and gzipped bundle size
    const bundleSizeInBytes = FileTools.getFileSizeInBytes(
      path.join(bundleFileDir, bundleFilename)
    );
    const minifiedBundleSizeInBytes = FileTools.getFileSizeInBytes(
      path.join(bundleFileDir, minifiedBundleFilename)
    );
    const minifiedAndGzippedBundleSizeInBytes = FileTools.getFileSizeInBytes(
      path.join(bundleFileDir, gzippedAndMinifiedBundleFilename)
    );

    // todo Cleanup all remove temp files
    // fs.unlinkSync(path.join(path.dirname(require.resolve(package_name)), temp_bundle_file_name));

    // Return the result with a field indicating that all went fine
    return {
      valid: true,
      bundleSizeInBytes,
      minifiedBundleSizeInBytes,
      minifiedAndGzippedBundleSizeInBytes,
    };
  } catch (error) {
    console.error(error);

    // Return only an object that indicates that the process has been failed
    return {
      valid: false,
    };
  }
};

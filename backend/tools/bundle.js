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
 * @return {String} Name of the bundle file.
 */
exports.bundlePackage = async function (packageName) {
  try {
    // First find the entry point of this package in its package.json
    const packageEntryPoint = await PackageTools.getPackageEntryPoint(packageName);

    const bundleFilename = PathTools.get_temp_filename() + '.js';
    const args = [packageEntryPoint, '--output-filename', bundleFilename];

    console.debug('args bundle_package', args);

    // todo check return values of spawned processes
    // todo check if webpack is in the path
    const opts = { cwd: path.join(path.dirname(require.resolve(`${packageName}/package.json`))) };
    const { stdout, stderr } = await execa('webpack', args, opts);

    return bundleFilename;
  } catch (error) {
    console.error('error', error);
    return null;
  }
};

/**
 * Minifies given bundle file using 'minify'.
 *
 * @param {String} bundleFileDir Directory in which bundle file is located.
 * @param {String} bundleFilename Name of the bundle file.
 * @todo Look for better minifiers.
 * @return {String}
 */
exports.minifyBundleFile = async function (bundleFileDir, bundleFilename) {
  // Create a filename for the minified version, e.g. 91239128391.js -> 91239128391.min.js
  const minifiedBundleFilename = PathTools.getMinifiedFilename(bundleFilename);
  const args = [bundleFilename, '-o', minifiedBundleFilename];
  const opts = { cwd: bundleFileDir };

  try {
    // todo check if minify is in the path
    const { stdout, stderr } = await execa('minify', args, opts);

    return minifiedBundleFilename;
  } catch (error) {
    console.error('error', error);
    return null;
  }
};

/**
 * Princial entry point for collecting bundle info. It minifies and gzips and then queries file size.
 *
 * @param {String} packageName Name of the package to be evaluated.
 * @return {Object} An object with 'size' property indicating size in bytes of the bundle.
 */
exports.getBundleSizeInfo = async function (packageName) {
  try {
    const bundleFileDir = path.join(path.dirname(require.resolve(`${packageName}/package.json`)));

    const bundleFilename = await this.bundlePackage(packageName);
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

    return {
      bundleSizeInBytes,
      minifiedBundleSizeInBytes,
      minifiedAndGzippedBundleSizeInBytes,
    };
  } catch (error) {
    console.error(error);
  }
};

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
 * @param {String} projectPath Path to project folder in which the package has been installed.
 * @return {String} Path to the bundled file relative to the project folder, i.e. dist/temp-1130929008.js.
 */
exports.bundlePackage = async function (packageName, projectPath) {
  try {
    // First find the entry point of this package in its package.json
    const packageEntryPoint = await PackageTools.getPackageEntryPoint(packageName, projectPath);

    const bundleFilename = PathTools.getTempFilename() + '.js';
    const args = [
      'node_modules/webpack/bin/webpack.js',
      path.join('node_modules', packageName, packageEntryPoint),
      '--output-filename',
      bundleFilename,
    ];

    // TODO check return values of spawned processes
    const opts = { cwd: projectPath };

    console.info('args bundle_package', args);
    console.info('opts bundle_package', opts);

    const { stdout, stderr } = await execa('node', args, opts);

    return path.join('dist', bundleFilename);
  } catch (error) {
    console.error('error', error);
    throw Error('Failed to bundle package: ' + error);
  }
};

/**
 * Minifies given bundle file using 'minify'.
 *
 * @param {String} bundlePath Path to the bundle file relative to the project folder.
 * @param {String} projectPath Path of the project where this bundle and corresponding package are found.
 * @return {String} Path to the minified bundle file relative to the project root folder.
 */
exports.minifyBundleFile = async function (bundlePath, projectPath) {
  // Create a filename for the minified version, e.g. 91239128391.js -> 91239128391.min.js
  const minifiedBundlePath = PathTools.getMinifiedFilename(bundlePath);
  const args = [
    'node_modules/uglify-js/bin/uglifyjs',
    '--mangle',
    '-o',
    minifiedBundlePath,
    '--',
    bundlePath,
  ];
  const opts = { cwd: projectPath };

  try {
    console.info('args minifyBundleFile', args);
    console.info('opts minifyBundleFile', opts);

    const { stdout, stderr } = await execa('node', args, opts);

    return minifiedBundlePath;
  } catch (error) {
    console.error('error', error);
    throw Error('Failed to minify bundle: ' + error);
  }
};

/**
 * Princial entry point for collecting bundle info. It minifies and gzips and then queries file size.
 *
 * @param {String} packageName Name of the package to be evaluated.
 * @param {String} projectPath Path to the project where given package has been installed.
 * @return {Object} An object with 'size' property indicating size in bytes of the bundle.
 */
exports.getBundleSizeInfo = async function (packageName, projectPath) {
  try {
    const bundlePath = await this.bundlePackage(packageName, projectPath);
    console.info('bundlePath', bundlePath);

    const minifiedBundlePath = await this.minifyBundleFile(bundlePath, projectPath);
    console.info('minifiedBundlePath', minifiedBundlePath);

    const gzippedAndMinifiedBundlePath = await FileTools.gzipFile(minifiedBundlePath, projectPath);
    console.info('gzippedAndMinifiedBundlePath', gzippedAndMinifiedBundlePath);

    // Report size of bundle size, minified bundle size and finally minified and gzipped bundle size
    const bundleSizeInBytes = FileTools.getFileSizeInBytes(path.join(projectPath, bundlePath));
    const minifiedBundleSizeInBytes = FileTools.getFileSizeInBytes(
      path.join(projectPath, minifiedBundlePath)
    );
    const minifiedAndGzippedBundleSizeInBytes = FileTools.getFileSizeInBytes(
      path.join(projectPath, gzippedAndMinifiedBundlePath)
    );

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

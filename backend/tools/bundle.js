const execa = require('execa');
const path = require('path');
const fs = require('fs');

const path_tools = require('./path');
const file_tools = require('./file');
const package_tools = require('./package');

// todo this is too big, refactor it
// make every step a function and make them return path to generated file
// then at the end of THIS get_bundle_info remove temporary files

// comment this and all
exports.bundle_package = async function (package_name) {
  try {
    // First find entry point of this package in its package.json
    const package_entry_point = await package_tools.get_package_entry_point(package_name);

    // webpack index.js --output-filename dist2/bundle.js
    const temp_bundle_file_name = path_tools.get_temp_filename() + '.js';
    const args = [package_entry_point, '--output-filename', temp_bundle_file_name];

    console.debug('args bundle_package', args);

    // todo check return values of spawned processes
    // todo check if webpack is in the path
    const { stdout, stderr } = await execa('webpack', args, {
      cwd: path.join(path.dirname(require.resolve(`${package_name}/package.json`))),
    });

    // console.debug("stdout", stdout);
    // console.debug("stderr", stderr);

    return temp_bundle_file_name;
    // Remove the temporary file
    // fs.unlinkSync(path.join(path.dirname(require.resolve(package_name)), temp_bundle_file_name));
  } catch (error) {
    console.debug('error', error);
  }
};

exports.minify_bundle_file = async function (bundle_file_dir, bundle_file_name) {
  // Minify the file
  // todo this is probably not the best minifier in town
  // minify 379298240.js -o 379298240.min.js
  // Create a filename for the minified version, e.g. 91239128391.js -> 91239128391.js
  const temp_minified_bundle_file_name = path_tools.get_minified_filename(bundle_file_name);
  const args = [bundle_file_name, '-o', temp_minified_bundle_file_name];
  const opts = {
    cwd: bundle_file_dir,
  };

  // console.debug('args', args);

  try {
    // todo check if webpack is in the path
    const { stdout, stderr } = await execa('minify', args, opts);

    // console.debug("stdout", stdout);
    // console.debug("stderr", stderr);

    // Remove the temporary file
    // fs.unlinkSync(path.join(path.dirname(require.resolve(package_name)), bundle_file_name));

    return temp_minified_bundle_file_name;
  } catch (error) {
    console.debug('error', error);
  }
};

exports.get_bundle_info = async function (package_name) {
  try {
    const bundle_file_dir = path.join(
      path.dirname(require.resolve(`${package_name}/package.json`))
    );
    // console.debug('bundle_file_dir', bundle_file_dir);

    const bundle_file_name = await this.bundle_package(package_name);
    console.debug('bundle_file_name', bundle_file_name);

    // const minified_bundle_file_name = await this.minify_bundle_file(bundle_file_dir, bundle_file_name);
    // // console.debug('minified_bundle_file_name', minified_bundle_file_name);

    // const gzipped_minified_bundle_file_name = await file_tools.gzip_file(bundle_file_dir, minified_bundle_file_name);
    // // console.debug('gzipped_minified_bundle_file_name', gzipped_minified_bundle_file_name);

    // const file_size = file_tools.get_file_size_in_bytes(path.join(bundle_file_dir, gzipped_minified_bundle_file_name));
    // // console.debug('file_size', file_size);

    // todo Cleanup all remove temp files

    return {
      // other info?
      // size: file_size
      size: 0,
    };
  } catch (error) {
    console.error(error);
  }
};

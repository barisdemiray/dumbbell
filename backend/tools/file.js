const execa = require('execa');
const path = require('path');
const fs = require('fs');

// todo this should be in tools/fs
exports.gzip_file = async function (bundle_file_dir, bundle_file_name) {
  // Gzip the file
  // minify 379298240.js -o 379298240.min.js
  // Create a filename for the minified version, e.g. 91239128391.js -> 91239128391.js
  // const temp_minified_bundle_file_name = path_tools.get_minified_filename(temp_bundle_file_name);
  const temp_gzipped_bundle_file_name = bundle_file_name + '.gz';
  const args = [bundle_file_name];
  const opts = {
    cwd: bundle_file_dir,
  };

  console.debug('args', args);

  try {
    // todo check if webpack is in the path
    const { stdout, stderr } = await execa('gzip', args, opts);

    // console.debug("stdout", stdout);
    // console.debug("stderr", stderr);

    // Remove the temporary file
    // fs.unlinkSync(path.join(path.dirname(require.resolve(package_name)), temp_bundle_file_name));

    return temp_gzipped_bundle_file_name;
  } catch (error) {
    console.debug('error', error);
  }
};

exports.get_file_size_in_bytes = function (file_path) {
  try {
    if (!fs.existsSync(file_path)) {
      throw new Error(`Cannot find file ${file_path}`);
    }

    // Get the file size of the minified and gzipped output
    let stats = fs.statSync(file_path);
    let file_size_in_bytes = stats['size'];

    // console.debug(`output at ${output_path} size`, file_size_in_bytes);

    return file_size_in_bytes;
  } catch (error) {
    console.error(error);
  }
};

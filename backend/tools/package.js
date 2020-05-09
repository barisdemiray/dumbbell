const execa = require('execa');
const path = require('path');
const fs = require('fs');

// todo do not bloat our own node_modules, install into temporary directory
exports.install_package = async function (package_name) {
  const args = ['add', package_name];

  try {
    const { stdout, stderr } = await execa('yarn', args);

    // console.debug('stdout', stdout);
    // console.debug('stderr', stderr);
  } catch (error) {
    console.debug('error', error);
  }
};

exports.uninstall_package = async function (package_name) {
  const args = ['remove', package_name];

  try {
    const { stdout, stderr } = await execa('yarn', args);

    // console.debug('stdout', stdout);
    // console.debug('stderr', stderr);
  } catch (error) {
    console.debug('error', error);
  }
};

exports.get_package_entry_point = async function (package_name) {
  // First we need the entry point of the package
  let package_entry_point = '';

  try {
    // const package_json_path = path.join('./node_modules', package_name, 'package.json');
    const package_json_path = require.resolve(`${package_name}/package.json`);
    console.debug('package_json_path', package_json_path);

    // Load package.json only if it exists
    if (fs.existsSync(package_json_path)) {
      package_entry_point = require(package_json_path).main;
    } else {
      throw new Error(`File ${package_json_path} does not exist`);
    }
  } catch (error) {
    console.error('error', error);
    throw new Error(`Failed to get entry point for package ${package_name}`);
  }

  console.debug('entry point is', package_entry_point);
  return package_entry_point;
};

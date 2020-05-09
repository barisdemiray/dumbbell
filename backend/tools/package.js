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

// todo Another way would be 'yarn info', perhaps?
exports.find_package_dependencies = function (package_name) {
  // Let's have a closure to keep a cumulative list of dependencies
  function do_find_package_dependencies(package_name) {
    try {
      const package_json_path = require.resolve(`${package_name}/package.json`);
      console.log('package.json path', package_json_path);

      // Load package.json only if it exists
      if (fs.existsSync(package_json_path)) {
        const { version, dependencies } = require(package_json_path);

        dependency_list.push(package_name);

        for (const dep in dependencies) {
          console.debug(`Found dependency ${dep} of ${package_name}`);
          dependency_list.push(dep);

          do_find_package_dependencies(dep);
        }
      } else {
        console.warn(`${package_json_path} does not exists, skipping...`);
      }
    } catch (error) {
      console.error('error', error);
    }
  }

  // Start the recursive dependency extraction, stack is our friend
  var dependency_list = [];
  do_find_package_dependencies(package_name);

  // List is possible not composed of unique elements at this point, make it so
  dependency_list = [...new Set(dependency_list)];

  return dependency_list;
};

exports.find_available_versions = async function (package_name) {
  // We'll get all available versions from 'yarn info'
  const args = ['info', '--json', package_name];

  try {
    const { stdout, stderr } = await execa('yarn', args);

    let versions = JSON.parse(stdout).data.versions;

    // Get all major versions
    const majors = version_tools.get_major_versions(versions);

    // Get last 4 versions, whatever the major is
    const last_4 = version_tools.get_last_n_versions(versions, 4);

    // Get last 4 versions of the last major version
    let last_4_of_last_major = [];
    if (majors) {
      let [last_major] = majors.slice(-1);
      last_4_of_last_major = version_tools.get_last_n_versions_of_major(versions, last_major, 4);
    }

    // Return an object with all required version info
    return {
      majors,
      last_4,
      last_4_of_last_major,
    };
  } catch (error) {
    console.debug('error', error);
  }
};

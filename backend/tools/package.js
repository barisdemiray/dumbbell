const execa = require('execa');
const fs = require('fs');
const path = require('path');

const VersionTools = require('./version');
const PathTools = require('./path');

/**
 * Installs package with given name using yarn.
 * @param {String} packageName Name of the package.
 * @return {String} Installation path on success, null otherwise.
 */
exports.installPackage = async function (packageName) {
  // Generate a temp folder
  const tempFolder = PathTools.getTempFolderPath();

  // Initialize a new package.json in the temp folder
  const initArgs = ['init', '--yes'];
  const initOpts = { cwd: tempFolder };

  // Create the temp folder
  try {
    fs.mkdirSync(tempFolder);
  } catch (error) {
    console.error(error);
    return null;
  }

  console.debug(`Initializing a new package.json in ${tempFolder} with Yarn`);
  console.debug('args yarn init', initArgs);
  console.debug('opts yarn init', initOpts);

  try {
    const { stdout, stderr } = await execa('yarn', initArgs, initOpts);
  } catch (error) {
    console.error('error', error);
    return null;
  }

  // Install the package
  const addArgs = ['add', packageName];
  const addOpts = { cwd: tempFolder };

  console.debug(`Installing package ${packageName} with command ${addArgs} to Yarn`);
  console.debug('args yarn add', addArgs);
  console.debug('opts yarn add', addOpts);

  try {
    const { stdout, stderr } = await execa('yarn', addArgs, addOpts);
    return path.join(tempFolder, 'node_modules');
  } catch (error) {
    console.error('error', error);
    return null;
  }
};

/**
 * Uninstalls package with given name using yarn.
 * @param {String} packageName Name of the package.
 * @return {Boolean} True on success, false otherwise.
 */
exports.uninstallPackage = async function (packageName) {
  const args = ['remove', packageName];

  console.debug(`Uninstalling package ${packageName} with command ${args} to Yarn`);

  try {
    const { stdout, stderr } = await execa('yarn', args);
    return true;
  } catch (error) {
    console.error('error', error);
    return false;
  }
};

/**
 * Finds a package's entry point from its package.json, i.e. 'main'.
 * @param {String} packageName Name of the package.
 * @param {String} modulesFolderPath Path to node_modules folder in which the package has been installed.
 * @return {String} Entry point of the package, i.e. corresponding script's file name.
 */
exports.getPackageEntryPoint = async function (packageName, modulesFolderPath) {
  let packageEntryPoint = '';

  try {
    const packageJsonPath = path.join(modulesFolderPath, packageName, 'package.json');

    // Load package.json only if it exists
    if (fs.existsSync(packageJsonPath)) {
      packageEntryPoint = require(packageJsonPath).main;
    } else {
      throw new Error(`File ${packageJsonPath} does not exist`);
    }
  } catch (error) {
    console.error('error', error);
    throw new Error(`Failed to get entry point for package ${packageName}`);
  }

  return packageEntryPoint;
};

/**
 * Recursively finds a package's dependencies and dependencies of its dependencies and dependencies of ...
 * @todo Look into 'yarn info' if it is easier.
 * @param {String} packageName Name of the package.
 * @param {String} modulesFolderPath Path to node_modules folder in which the package has been installed.
 * @return {Array} An array of all the dependencies needed for given package.
 */
exports.findPackageDependencies = function (packageName, modulesFolderPath) {
  // Let's have a closure to be able to keep a cumulative list of dependencies
  function doFindPackageDependencies(packageName) {
    try {
      const packageJsonPath = path.join(modulesFolderPath, packageName, 'package.json');

      // Load package.json only if it exists
      if (fs.existsSync(packageJsonPath)) {
        const { version, dependencies } = require(packageJsonPath);

        overallDependencyList.push(packageName);

        for (const dep in dependencies) {
          console.debug(`Found dependency ${dep} of ${packageName}`);
          overallDependencyList.push(dep);

          // Dive again for this very package's dependencies
          doFindPackageDependencies(dep);
        }
      } else {
        console.warn(`${packageJsonPath} does not exists, skipping...`);
      }
    } catch (error) {
      console.error('error', error);
    }
  }

  // Start the recursive dependency extraction, stack is our friend
  var overallDependencyList = [];
  doFindPackageDependencies(packageName);

  // It is possible that the list have duplicate elements at this point, remove duplicates
  overallDependencyList = [...new Set(overallDependencyList)];

  return overallDependencyList;
};

/**
 * Returns following available versions of package with given name.
 * - Last 3 versions of the last major version, or less if there aren't enough.
 * - Last version of the previous major version.
 * @return {Object} An object with 2 properties as lists for these set of versions.
 */
exports.findRecentVersions = async function (packageName) {
  // We'll get all available versions from 'yarn info'
  const args = ['info', '--json', packageName];

  try {
    const { stdout, stderr } = await execa('yarn', args);
    const yarnInfo = JSON.parse(stdout);

    // Be sure the package exists
    if (yarnInfo.type === 'error') {
      throw new Error(`Yarn returned error for package ${packageName}`);
    }

    let versions = yarnInfo.data.versions;

    // Get all major versions
    const majors = VersionTools.getMajorVersions(versions);

    // Get last 3 versions of the last major version
    let lastThreeVersionsOfLastMajor = [];
    if (majors) {
      let lastMajorVersion = majors[0];
      lastThreeVersionsOfLastMajor = VersionTools.getLastNVersionsOfMajor(
        versions,
        lastMajorVersion,
        3
      );
    }

    // Get last version of the previous major
    let lastVersionOfPreviousMajor = '';
    if (majors.length >= 2) {
      const previousMajor = majors[1];
      lastVersionOfPreviousMajor = VersionTools.getLastNVersionsOfMajor(
        versions,
        previousMajor,
        1
      )[0];
    }

    // Return an object with all required version info
    return {
      lastThreeVersionsOfLastMajor,
      lastVersionOfPreviousMajor,
    };
  } catch (error) {
    console.debug('error', error);
    throw new Error('Failed to find versions. Package may not be existing.');
  }
};

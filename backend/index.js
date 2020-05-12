'use strict';

const http = require('http');
const url = require('url');
const path = require('path');

const PackageTools = require('./tools/package');
const BundleTools = require('./tools/bundle');
const FileTools = require('./tools/file');

/**
 * Returns in an array the bundle size of a package for its last few versions.
 * @param {String} packageName Name of the package to be evaluated.
 * @return {Array} Array of objects containing a 'size' property of every versions' bundle.
 */
const getBundleSizeInfoForRecentVersions = async (packageName) => {
  try {
    const versions = await PackageTools.findRecentVersions(packageName);

    if (!versions) {
      return [];
    }

    let bundleInfos = [];

    // Make a list of all versions requested
    const allVersionsToEvaluate = [
      ...versions.lastThreeVersionsOfLastMajor,
      ...versions.lastVersionOfPreviousMajor,
    ];

    console.info('I will iterate on versions', allVersionsToEvaluate);

    // Iterate available versions and do the following for each of them
    // - Install the package at that version
    // - Get size information of its bundle
    // - Uninstall the package
    for (const version of allVersionsToEvaluate) {
      const packageNameWithVersion = packageName + '@' + version;

      console.info(`Getting bundle info for version ${packageNameWithVersion}`);

      // Install the package to a temporary folder and get the path
      const modulesFolder = await PackageTools.installPackage(packageNameWithVersion);

      // If the installation has failed, try with the next version
      if (!modulesFolder) {
        console.error(`Failed at installing ${packageNameWithVersion}`);
        continue;
      }

      // Get bundle size info first
      let bundleInfo = await BundleTools.getBundleSizeInfo(packageName, modulesFolder);

      if (bundleInfo.valid) {
        // Develop the object with package version
        bundleInfo = Object.assign(bundleInfo, { version });

        bundleInfos.push(bundleInfo);
      }

      // Success or not, remove the temporary project folder, i.e. parent folder of
      // the modules path of this installation
      const projectFolderToRemove = path.normalize(path.join(modulesFolder, '..'));
      console.info(`Removing temporary project folder ${projectFolderToRemove}`);
      await FileTools.removeFolder(modulesFolder);
    }

    console.info(`bundle info for ${packageName}`, bundleInfos);

    return bundleInfos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Let's create a basic server and set up CORS so our querystrings pass.
// TODO Use here process.env.(HOST|PORT)
const SERVER_HOST = 'localhost';
const SERVER_PORT = 80;
const OK_CODE = 200;
const KO_CODE = 500;

const server = http.createServer(function (req, res) {
  let query = url.parse(req.url, true).query;
  var packageName = query.package;

  console.info(`User is asking about the package '${packageName}'`);

  // Enable CORS requests to allow querystrings
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  getBundleSizeInfoForRecentVersions(packageName)
    .then((data) => {
      // There might still have been an error
      if (!data) {
        res.statusCode = KO_CODE;
        res.end(JSON.stringify([], null, 2));
      } else {
        res.statusCode = OK_CODE;
        res.end(JSON.stringify(data, null, 2));
      }
    })
    .catch((error) => {
      res.statusCode = KO_CODE;
      res.end(JSON.stringify([], null, 2));
      console.error(error);
    });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server running on ${SERVER_HOST}:${SERVER_PORT}`);
});

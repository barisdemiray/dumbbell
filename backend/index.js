'use strict';

const http = require('http');
const url = require('url');

const PackageTools = require('./tools/package');
const BundleTools = require('./tools/bundle');

/**
 * Returns in an array the bundle size of a package for its last few versions.
 * @param {String} packageName Name of the package to be evaluated.
 * @return {Array} Array of objects containing a 'size' property of every versions' bundle.
 */
const getBundleSizeInfoForRecentVersions = async (packageName) => {
  const versions = await PackageTools.findAvailableVersions(packageName);

  let bundleInfos = [];

  if (!versions) {
    return [];
  }

  // Iterate available versions and do the following for each of them
  // - Install the package at that version
  // - Get size information of its bundle
  // - Uninstall the package
  for (const version of versions.lastFourVersions) {
    const packageNameWithVersion = packageName + '@' + version;

    console.debug(`Getting bundle info for version ${packageNameWithVersion}`);

    await PackageTools.installPackage(packageNameWithVersion);

    // Get bundle size info first
    let bundleInfo = await BundleTools.getBundleSizeInfo(packageName);

    // Develop the object with package version
    bundleInfo = Object.assign(bundleInfo, { version });

    bundleInfos.push(bundleInfo);

    await PackageTools.uninstallPackage(packageName);
  }

  console.debug(`bundle info for ${packageName}`, bundleInfos);

  return bundleInfos;
};

// Let's create a basic server and set up CORS so our querystrings pass.
const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 8080;
const OK_CODE = 200;
const KO_CODE = 500;

const server = http.createServer(function (req, res) {
  let query = url.parse(req.url, true).query;
  var packageName = query.package;

  console.debug(`User is asking about the package '${packageName}'`);

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

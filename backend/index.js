'use strict';

const http = require('http');
const url = require('url');

const package_tools = require('./tools/package');
const bundle_tools = require('./tools/bundle');

/**
 * Returns in an array the bundle size of a package for its last few versions.
 * @param {String} Name of the package to be evaluated.
 * @return {Array} Array of objects containing a 'size' property of every versions' bundle.
 */
const get_bundle_info = async (package_name) => {
  const versions = await package_tools.find_available_versions(package_name);

  let bundleInfo = [];

  if (!versions) {
    return [];
  }

  // todo slice(-1) is temporary for tests
  for (const version of versions.last_4.slice(-1)) {
    const package_name_with_version = package_name + '@' + version;

    console.log(`Getting bundle info for version ${package_name_with_version}`);
    await package_tools.install_package(package_name_with_version);

    const bundle_info = await bundle_tools.get_bundle_info(package_name);
    bundleInfo.push(bundle_info);

    await package_tools.uninstall_package(package_name);
  }

  // TODO report versios here too!
  console.debug(`bundle info for ${package_name}`, bundleInfo);

  return bundleInfo;
};

const server = http.createServer(function (req, res) {
  let query = url.parse(req.url, true).query;
  var package_name = query.package;

  console.debug('user is asking for package', package_name);

  // Enable CORS requests to allow querystrings
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  get_bundle_info(package_name)
    .then((data) => {
      // There might still have been an error
      if (!data) {
        res.statusCode = 200;
        res.end(JSON.stringify({ size: 0 }, null, 2));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(data[0], null, 2));
      }
    })
    .catch((error) => {
      res.statusCode = 500;
      res.end(
        JSON.stringify(
          {
            size: 0,
          },
          null,
          2
        )
      );
      console.error(error);
    });
});

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 8080;

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server running on ${SERVER_HOST}:${SERVER_PORT}`);
});

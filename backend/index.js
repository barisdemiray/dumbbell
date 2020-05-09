'use strict';

const http = require('http');
const url = require('url');

const package_tools = require('./tools/package');
const bundle_tools = require('./tools/bundle');

const get_bundle_info = async (package_name) => {
  const versions = await package_tools.find_available_versions(package_name);

  let bundle_infos = [];

  // todo slice(-1) is temporary for tests
  for (const version of versions.last_4.slice(-1)) {
    const package_name_with_version = package_name + '@' + version;

    console.log(`Getting bundle info for version ${package_name_with_version}`);
    await package_tools.install_package(package_name_with_version);

    const bundle_info = await bundle_tools.get_bundle_info(package_name);
    bundle_infos.push(bundle_info);

    await package_tools.uninstall_package(package_name);
  }

  // todo report versios here too!
  console.debug(`bundle info for ${package_name}`, bundle_infos);

  return true;
};

// todo test with 'expect' after, it may be requiring a webpack loader config
// get_bundle_info('expect')
//   .then((data) => {
//     console.debug(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const server = http.createServer(function (req, res) {
  let query = url.parse(req.url, true).query;
  var package_name = query.package;

  console.debug('user is asking for package', package_name);

  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');

  const fake_response = {
    size: 40,
  };

  res.end(JSON.stringify(fake_response, null, 2));
});

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 8080;

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server running on ${SERVER_HOST}:${SERVER_PORT}`);
});

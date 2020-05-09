'use strict';

const package_tools = require('./tools/package');
const bundle_tools = require('./tools/bundle');

const get_bundle_info = async (package_name) => {
  const versions = await package_tools.find_available_versions_of_package(package_name);

  let bundle_infos = [];

  let _versions = versions.last_4.slice(-1);
  console.log(_versions);

  for (const version of _versions) {
    const package_name_with_version = package_name + '@' + version;
    console.log(`Getting bundle info for version ${package_name_with_version}`);

    // await package_tools.install_package(package_name_with_version);

    const bundle_info = await bundle_tools.get_bundle_info(package_name);
    bundle_infos.push(bundle_info);

    // await package_tools.uninstall_package(package_name);
  }

  console.debug(`bundle info for ${package_name}`, bundle_infos);

  return true;
};

get_bundle_info('expect')
  .then((data) => {
    console.debug(data);
  })
  .catch((error) => {
    console.error(error);
  });

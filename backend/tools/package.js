const execa = require('execa');
// const path = require('path');
// const fs = require('fs')

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

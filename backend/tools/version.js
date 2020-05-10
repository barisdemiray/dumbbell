const semver = require('semver');

/**
 * Cleans invalid or pre-release values from a list with semvers.
 */
exports.clean_version_list = function (version_list) {
  // console.log('received', arguments);

  // Remove all values that is not valid
  let _versions = version_list.filter((version) => !semver.valid(version_list));

  // Remove all versions that include a prerelease tag, e.g. alpha
  return _versions.filter((version) => !semver.prerelease(version));
};

exports.get_major_versions = function (version_list) {
  // console.log('received', arguments);

  let _versions = this.clean_version_list(version_list);

  let major_versions = [];
  _versions.map((version) => major_versions.push(semver.major(version)));
  major_versions = [...new Set(major_versions)];

  return major_versions;
  // console.log('major_versions', major_versions);
};

exports.get_last_n_versions = function (version_list, n) {
  // console.log('received', arguments);

  let _versions = this.clean_version_list(version_list);

  // If there are not enough versions, return the whole list
  if (_versions.length <= n) {
    return _versions;
  }

  return _versions.slice(-n);
};

exports.getLastNVersionsOfMajor = function (version_list, major, n) {
  console.log('received', arguments);

  let _versions = this.clean_version_list(version_list);

  // Find all versions with given major version
  _versions = _versions.filter((version) => semver.major(version) === major);

  // If there are not enough versions with given major, return the whole list
  if (_versions.length <= n) {
    return _versions;
  }

  // Else take a slice of it
  return _versions.slice(-n);
};

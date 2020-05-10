const semver = require('semver');

/**
 * Cleans invalid or pre-release values from a list of versions.
 * @param {Array} versionList List of versions.
 * @return {Array} List of valid versions.
 */
exports.cleanVersionList = function (versionList) {
  // Remove all values that is not valid
  let versions = versionList.filter((version) => semver.valid(version));

  // Remove all versions that include a prerelease tag, e.g. alpha
  return versions.filter((version) => !semver.prerelease(version));
};

/**
 * Finds all major version numbers in given list of versions.
 * @param {Array} versionList List of versions.
 * @return {Array} List of major version numbers only.
 */
exports.getMajorVersions = function (versionList) {
  let versions = this.cleanVersionList(versionList);

  // Get only the major versions
  let majorVersions = [];
  versions.map((version) => majorVersions.push(semver.major(version)));

  // Remove duplicates from the list
  majorVersions = [...new Set(majorVersions)];

  return majorVersions;
};

/**
 * Returns last N versions from given list with versions.
 * @param {Array} versionList List of versions.
 * @param {Number} n Number of versions to return.
 * @return Last n numbers, or less in case incoming list had less than n versions.
 */
exports.getLastNVersions = function (versionList, n) {
  let versions = this.cleanVersionList(versionList);

  // If there are not enough versions, return the whole list
  if (versions.length <= n) {
    return versions;
  }

  // Or the last n
  return versions.slice(-n);
};

exports.getLastNVersionsOfMajor = function (versionList, major, n) {
  let versions = this.cleanVersionList(versionList);

  // Find all versions with given major version
  versions = versions.filter((version) => semver.major(version) === major);

  // If there are not enough versions with given major, return the whole list
  if (versions.length <= n) {
    return versions;
  }

  // Else take a slice of it
  return versions.slice(-n);
};

/**
 * Checks if given NPM package name is valid.
 *
 * @todo More rules to be added from https://docs.npmjs.com/files/package.json.
 * @param {String} Package name to verify.
 * @return {Object} An object containing a boolean and a reason field. Reason will be empty if result is true.
 */
export const isPackageNameValid = (package_name) => {
  // Start with an invalid state
  let result = {
    valid: false,
    reason: '',
  };

  if (typeof package_name !== 'string') {
    result.reason = 'Package name has to be string';
  } else if (package_name.indexOf(' ') >= 0) {
    result.reason = 'Package names should not have spaces';
  } else if (package_name.length === 0) {
    result.reason = 'Package name cannot be empty';
  } else if (package_name.charAt(0) === '.' || package_name.charAt(0) === '_') {
    result.reason = 'Package names cannot start with a dot or an underscore';
  } else {
    result.valid = true;
    result.reason = '';
  }

  return result;
};

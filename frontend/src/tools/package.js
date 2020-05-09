export const isPackageNameValid = (package_name) => {
  // todo https://docs.npmjs.com/files/package.json

  let result = {
    valid: false,
    message: '',
  };

  if (typeof package_name !== 'string') {
    result.message = 'Package name has to be string';
  } else if (package_name.indexOf(' ') >= 0) {
    result.message = 'Package names should not have spaces';
  } else if (package_name.length === 0) {
    result.message = 'Package name cannot be empty';
  } else if (package_name.charAt(0) === '.' || package_name.charAt(0) === '_') {
    result.message = 'Package names cannot start with dot or underscore characters';
  } else {
    result.message = '';
  }

  return result;
};

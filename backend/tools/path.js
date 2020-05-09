var crypto = require('crypto');

exports.get_temp_filename = function () {
  return 'temp-' + crypto.randomBytes(4).readUInt32LE(0);
};

exports.get_minified_filename = function (filename) {
  if (typeof filename !== 'string' || filename.length === 0) {
    throw new Error('Given filename is not valid');
  }

  // Find last dot and then replace it with '.min.'
  const last_dot_index = filename.lastIndexOf('.');

  if (last_dot_index < 0) {
    throw new Error('Given filename does not have an extension');
  }

  return filename.substr(0, last_dot_index) + '.min.' + filename.substr(last_dot_index + 1);
};

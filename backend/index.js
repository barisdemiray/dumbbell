'use strict';

const package_tools = require('./tools/package');

package_tools.get_package_entry_point('eslint').then((result) => console.log(result));

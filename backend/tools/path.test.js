const PathTools = require('./path');

/**
 * Test suite for the set of methods in PathTools.
 */
describe('Path tools behaves correctly', () => {
  /**
   * Check if temp path generation works correctly.
   */
  describe('Temp path generation behaves correctly', () => {
    test('Check that a different temp file path is generated each time', () => {
      const paths = new Set();
      paths.add(PathTools.getTempFilename());
      paths.add(PathTools.getTempFilename());
      paths.add(PathTools.getTempFilename());
      paths.add(PathTools.getTempFilename());
      paths.add(PathTools.getTempFilename());

      // There should be 5 unique paths
      expect(paths.size).toBe(5);
    });
  });

  /**
   * Check if temp folder path generation works correctly.
   */
  describe('Temp folder path generation behaves correctly', () => {
    test('Check that a different temp folder path is generated each time', () => {
      const paths = new Set();
      paths.add(PathTools.getTempFolderPath());
      paths.add(PathTools.getTempFolderPath());
      paths.add(PathTools.getTempFolderPath());
      paths.add(PathTools.getTempFolderPath());
      paths.add(PathTools.getTempFolderPath());

      // There should be 5 unique paths
      expect(paths.size).toBe(5);
    });
  });

  /**
   * Check if minified file name generation works correctly.
   */
  describe('Minified file name generation behaves correctly', () => {
    test('Check that minified file name is generated correctly', () => {
      const fileName = 'temp-123kd01o0dw.js';
      const expectedFileName = 'temp-123kd01o0dw.min.js';
      const minifiedFileName = PathTools.getMinifiedFilename(fileName);

      expect(minifiedFileName).toBe(expectedFileName);
    });
  });

  /**
   * Check if we can join paths to find module installation path.
   */
  describe('Module installation folder generation behaves correctly', () => {
    test('Check that module installation folder is generated correctly', () => {
      const packageName = 'hello';
      const projectFolder = '/tmp/123kd01o0dw';
      const moduleInstallationPath = PathTools.getModuleInstallationPath(
        packageName,
        projectFolder
      );

      expect(moduleInstallationPath).toBe(projectFolder + '/node_modules/' + packageName);
    });
  });
});

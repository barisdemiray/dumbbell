const VersionTools = require('./version');

/**
 * Test suite for the set of methods in VersionTools.
 */
describe('Version tools behaves correctly', () => {
  /**
   * Check if invalid or pre-release version removal works correctly.
   */
  describe('Version cleaning behaves correctly', () => {
    /**
     * Check if invalid or pre-release versions are removed and valid ones are NOT removed.
     */
    test('Clears given list of versions by removing pre-release ones', () => {
      const dirtyVersionList = ['0.0.1', '0.2.0-alpha', '0.3.0', '0.4.0-rc4'];

      const cleanVersionList = VersionTools.cleanVersionList(dirtyVersionList);

      // Only two should have been left in the array
      expect(cleanVersionList.length).toBe(2);
      expect(cleanVersionList).toContain('0.0.1');
      expect(cleanVersionList).not.toContain('0.2.0-alpha');
      expect(cleanVersionList).toContain('0.3.0');
      expect(cleanVersionList).not.toContain('0.4.0-rc4');
    });

    /**
     * Check if empty arrays are handled correctly.
     */
    test('Version cleaning handles an empty array correctly', () => {
      const emptyArray = [];
      const cleanedArray = VersionTools.cleanVersionList(emptyArray);

      expect(cleanedArray.length).toBe(0);
    });
  });
});

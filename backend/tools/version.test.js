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

  /**
   * Check if major version filtering works correctly.
   */
  describe('Major version filtering behaves correctly', () => {
    /**
     * Check if only majors are returned from a list.
     */
    test('Returns only the major versions from a list', () => {
      const versionList = ['1.0.1', '2.2.0-alpha', '3.3.0', '4.4.0-rc4'];

      const majorVersions = VersionTools.getMajorVersions(versionList);

      // Only two should have been left in the array
      expect(majorVersions.length).toBe(2);
      expect(majorVersions).toContain(1);
      expect(majorVersions).not.toContain(2);
      expect(majorVersions).toContain(3);
      expect(majorVersions).not.toContain(4);
    });

    /**
     * Check if empty arrays are handled correctly.
     */
    test('Major version filtering handles an empty array correctly', () => {
      const emptyArray = [];
      const majorVersions = VersionTools.getMajorVersions(emptyArray);

      expect(majorVersions.length).toBe(0);
    });
  });

  /**
   * Check if getting last N versions from a version list works correctly.
   */
  describe('Getting last N versions from a version list behaves correctly', () => {
    /**
     * Check if only last N versions are returned from a list.
     */
    test('Returns only the last N versions from a list', () => {
      const versionList = ['1.0.0', '2.0.0', '3.0.0', '4.4.0', '4.5.0', '6.0.0'];

      const lastThree = VersionTools.getLastNVersions(versionList, 3);

      // Only three should have been left in the array
      expect(lastThree.length).toBe(3);
      expect(lastThree).toContain('6.0.0');
      expect(lastThree).toContain('4.5.0');
      expect(lastThree).toContain('4.4.0');

      expect(lastThree).not.toContain('3.0.0');
      expect(lastThree).not.toContain('2.0.0');
      expect(lastThree).not.toContain('1.0.0');
    });

    /**
     * Check if last N version filtering handles empty arrays correctly.
     */
    test('Last N version filtering handles an empty array correctly', () => {
      const emptyArray = [];
      const lastFive = VersionTools.getLastNVersions(emptyArray, 5);

      expect(lastFive.length).toBe(0);
    });
  });

  /**
   * Check if getting last N versions of a major from a version list works correctly.
   */
  describe('Getting last N versions of a major from a version list behaves correctly', () => {
    /**
     * Check if only last N versions of a major are returned from a list.
     */
    test('Returns only the last N versions of a major from a list', () => {
      const versionList = ['1.0.0', '2.0.0', '3.0.0', '4.4.0', '4.5.0', '6.0.0'];

      const lastThreeOfMajorFour = VersionTools.getLastNVersionsOfMajor(versionList, 4, 3);

      // Only two (since there are only 2 in the list) should have been left in the array
      expect(lastThreeOfMajorFour.length).toBe(2);
      expect(lastThreeOfMajorFour).toContain('4.5.0');
      expect(lastThreeOfMajorFour).toContain('4.4.0');

      expect(lastThree).not.toContain('6.0.0');
      expect(lastThree).not.toContain('3.0.0');
      expect(lastThree).not.toContain('2.0.0');
      expect(lastThree).not.toContain('1.0.0');
    });

    /**
     * Check if last N version of a major filtering handles empty arrays correctly.
     */
    test('Last N version filtering of a major handles an empty array correctly', () => {
      const emptyArray = [];
      const lastFive = VersionTools.getLastNVersionsOfMajor(emptyArray, 2, 5);

      expect(lastFive.length).toBe(0);
    });
  });
});

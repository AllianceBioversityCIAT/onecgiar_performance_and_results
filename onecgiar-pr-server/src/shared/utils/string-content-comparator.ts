export class StringContentComparator {
  /**
   * Compares two strings while considering specific Unicode characters as equivalent.
   * Performs a case-insensitive and culture-sensitive comparison using the English ("en") locale.
   *
   * @param {string} string1 - The first string to compare.
   * @param {string} string2 - The second string to compare.
   * @returns {boolean} - Returns true if the contents of the strings are the same after considering the specific Unicode characters as equivalent. Returns false otherwise.
   *
   * @example
   * var stringOne = 'İstanbul';
   * var stringTwo = 'istanbul';
   * console.log(StringContentComparator.contentCompare(stringOne, stringTwo));  // Output: true
   *
   * var stringThree = 'Café';
   * var stringFour = 'cafe';
   * console.log(StringContentComparator.contentCompare(stringThree, stringFour));  // Output: true
   *
   * var stringFive = 'Über';
   * var stringSix = 'uber';
   * console.log(StringContentComparator.contentCompare(stringFive, stringSix));  // Output: true
   */
  static contentCompare(
    stringOne: string | null,
    stringTwo: string | null,
    nullFirst: boolean = false,
  ): number {
    if (stringOne == null && stringTwo == null) {
      return 0;
    } else if (stringOne == null || stringTwo == null) {
      return nullFirst ? Number.MAX_VALUE : Number.MIN_VALUE;
    } else {
      return stringOne.localeCompare(stringTwo, 'en', { sensitivity: 'base' });
    }
  }
}

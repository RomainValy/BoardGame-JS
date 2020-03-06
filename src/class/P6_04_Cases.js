/**
 * Class representant les cases
 *
 * @format
 * @extends GameObject
 */

class Cases extends GameObject {
  /**
   * @param {extends props} GOProp props of GameObject
   * @param {boolean} accessible
   */
  constructor({ accessible, ...GOProp }) {
    super(GOProp);
    this.accessible = accessible;
  }
}

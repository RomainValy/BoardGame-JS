/**
 * @format
 * @extends Cases
 */

class Character extends Cases {
  /**
   *
   * @param {number} damageFactor
   * @param {number} moveCapacity
   * @param {number} hp
   * @param {object} arme
   * @param {object|number} coordinate
   * @param {object} ancianWeapon
   * @param {extend} CaProp props extend of Cases
   *
   */
  constructor({
    damageFactor,
    moveCapacity,
    hp,
    arme,
    coordinate,
    ancianWeapon,
    ...CaProp
  }) {
    super(CaProp);
    this.damageFactor = damageFactor;
    this.moveCapacity = moveCapacity;
    this.hp = hp;
    this.arme = arme;
    this.ancianWeapon = ancianWeapon;
  }
}

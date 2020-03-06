class Weapon extends Cases {
    constructor({ damage, myWeapons, ...CaProp }) {
        super(CaProp);
        this.damage = damage;
        this.accessible = true;
       
    }

}
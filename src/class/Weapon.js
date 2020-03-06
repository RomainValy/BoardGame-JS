class Weapon extends Cases {
    constructor({ damage, myWeapons, ...CaProp }) {
        super(CaProp);
        this.damage = damage;
        this.accessible = true;
        //this.pushWeaponInMyWeapons();
    }

    pushWeaponInMyWeapons() {
        //Trop d'imbriquation si tu place ça ici
        //boardGame.myWeapons.push(this);

    }

}
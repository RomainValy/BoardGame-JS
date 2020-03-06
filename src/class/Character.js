class Character extends Cases {
    constructor({ damageFactor, moveCapacity, hp, arme, coordinate, ancianWeapon, ...CaProp }) {

        super(CaProp);
        this.damageFactor = damageFactor;
        this.moveCapacity = moveCapacity;
        this.hp = hp;
        this.arme = arme;
        this.ancianWeapon = ancianWeapon;
        //this.pushCharactersnInMyCharacters();
    }

    pushCharactersnInMyCharacters() {
        // trop d'imbriquation si tu place ça ici
        //boardGame.myCharacters.push(this);

    }
}
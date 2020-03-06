// lancement de l'interface de jeu
const shuffleNumber = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // on ajoute +1 pour que la valeur max soit celle que l'on a mit en parametre et non l'entier inférieur.
}


// ----- les armes -----

const craftWeapon = (name, damage, cssClass) => {
    return new Weapon({
        name: name,
        damage: Number(damage),
        cssClass: cssClass,
    })
}


gameStart = () => {

    const axe = craftWeapon("hache", 20, "axe");
    
    const legendarySword = craftWeapon("épée légandaire", 24, "sword");
    
    const knife = craftWeapon("couteau", 10, "knife");
    
    const dagger = craftWeapon("Double Dague", 7 * 2, "dagger");
    
    const boardGame = new BoardGame({
        lines: 10,
        columns: 10,
        cssClass: "plateau",
        player1: new Character({
            name: "joueur 1",
            x: 1,
            y: 5,
            moveCapacity: 3,
            damageFactor: 1,
            accessible: false,
            cssClass: "player1",
            hp: 100,
            arme: knife,
            fightAction: "",
        }),
        player2: new Character({
            name: "joueur 2",
            x: 5,
            y: 1,
            moveCapacity: 3,
            damageFactor: 1,
            accessible: false,
            cssClass: "player2",
            hp: 100,
            arme: knife,
            fightAction: "",
        }),
        weapons: [
            axe,
            legendarySword,
            knife,
            dagger,
        ]
    })

    new DisplayManager({boardGame})
    
    boardGame.getCurrentPlayerPossibleCases();

}

// lancement de partie avec board et players déjà pré-configurés
window.addEventListener("load", gameStart)
class Coordinates {
    constructor({ x, y }) {
        this.x = x;
        this.y = y;

    }
}


class GameObject extends Coordinates {
    /*CoProp pour Coordinate Proprieties*/
    constructor({ name, cssClass, ...CoProp }) {
        super(CoProp);
        this.name = name;
        this.cssClass = cssClass;

    }
}

class Cases extends GameObject {
    /*GOProp pour GameObject Proprieties*/
    constructor({ accessible, nbr, ...GOProp }) {
        super(GOProp);
        this.accessible = accessible;
    }
}

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

class BoardGame {
    constructor({
        lines,
        columns,
        cssClass,
        player1,
        player2,
        weapons = [],
    }) {
        this.lines = Number(lines);
        this.columns = Number(columns);
        this.cssClass = cssClass;
        this.cases = [];
        this.myWeapons = weapons;
        this.player1 = player1;
        this.player2 = player2;
        this.myCharacters = [player1, player2];
        this.currentPlayer = player1;
        this.enemy = this.player2;
        this.generateEmptyArray();
        this.generateBoardGame();
        this._onChange = function() {}
    }

    generateEmptyArray() {
        for (let x = 1; x <= this.lines; x++) {
            this.cases.push(new Array(this.columns));
        }
    }

    charactersPlacement() {
        // TODO change this
        this.myCharacters.forEach((element) => {
            this.cases[element.x][element.y] = element;
        })
    }

    weaponPlacement(element) {
        if (element && element.name !== this.player1.arme.name) {

            let x = shuffleNumber(0, this.lines - 1);
            let y = shuffleNumber(0, this.columns - 1);

            if (this.cases[x][y] === undefined) {

                element.x = x;
                element.y = y;
                this.cases[x][y] = element;
            } else {
                this.weaponPlacement();
            }
        }
    }

    weaponsPlacement() {
        for (let i = 0; i < this.myWeapons.length; i++) {

            this.weaponPlacement(this.myWeapons[i]);
        }
    }

    wallUniquePlacement() {

        let x = shuffleNumber(0, this.lines - 1);
        let y = shuffleNumber(0, this.columns - 1);

        if (this.cases[x][y] === undefined) {
            this.cases[x][y] = new Cases({ x, y, name: "wall", cssClass: "wall", accessible: false });
        }
        else {
            this.wallUniquePlacement();
        }
    }

    wallsPlacement() {
        for (let i = 0; i <= Math.round(this.columns * this.lines / 5); i++) {
            this.wallUniquePlacement();
        }
    }

    emptyCasesPlacement() {

        for (let x = 0; x <= this.lines - 1; x++) {

            for (let y = 0; y <= this.columns - 1; y++) {
                if (this.cases[x][y] === undefined) {
                    this.cases[x][y] = new Cases({ x, y, name: "case vide", cssClass: "caseVide", accessible: true });
                };
            }
        }
    }

    generateBoardGame() {
        this.charactersPlacement();
        this.weaponsPlacement();
        this.wallsPlacement();
        this.emptyCasesPlacement();
        //console.logtable(this.cases)
    }

    getCaseByIndex(x, y) {
        if (x >= 0
            && x < this.lines
            && y >= 0
            && y < this.columns
        ) {

            return this.cases[x][y];

        } else {
            return undefined;
        }

    }


    // deplacement de cases
    switchCases(target) {

        if (this.currentPlayer === this.player1) {

            const origin = this.player1;
            const targetCoordinate = target.id.split(",");
            const copyTarget = this.cases[targetCoordinate[0]][targetCoordinate[1]];

            if (copyTarget.name === "case vide"
                && this.player1.ancianWeapon === undefined
            ) {

                this.cases[origin.x][origin.y] = new Cases({ x: origin.x, y: origin.y, name: "case vide", cssClass: "caseVide", accessible: true });

                this.player1.x = copyTarget.x;
                this.player1.y = copyTarget.y;

                this.cases[this.player1.x][this.player1.y] = this.player1;

                this.currentPlayer = this.player1;
                this.enemy = this.player2

            }

            else {
                if (this.player1.ancianWeapon === undefined) {
                    // cases de départ si celle ci était à l'orogone une case vide et celle de destinaion un arme
                    this.cases[origin.x][origin.y] = new Cases({ x: origin.x, y: origin.y, name: "case vide", cssClass: "caseVide", accessible: true });
                    // l'arme actuellement équipée passe en ancienne arme

                    this.player1.ancianWeapon = this.player1.arme;

                    // on équipe la nouvelle arme
                    this.player1.arme = new Weapon({
                        name: copyTarget.name,
                        damage: copyTarget.damage,
                        accessible: true,
                        cssClass: copyTarget.cssClass,
                    });
                    //console.loglog("joueur 1 laisse tomber " + this.player1.ancianWeapon + " et équipe: " + this.player1.arme.name)
                    // nouvelle coordonées a player1
                    this.player1.x = copyTarget.x;
                    this.player1.y = copyTarget.y;

                    // placement de l'objet dans le tableau
                    this.cases[this.player1.x][this.player1.y] = this.player1;
                    // actualisation de currentPlayer
                    this.currentPlayer = this.player1;
                    this.enemy = this.player2

                } else {

                    this.cases[origin.x][origin.y] = new Weapon({
                        x: origin.x,
                        y: origin.y,
                        name: origin.ancianWeapon.name,
                        damage: origin.ancianWeapon.damage,
                        accessible: true,
                        cssClass: origin.ancianWeapon.cssClass,
                    });

                    this.player1.x = copyTarget.x;
                    this.player1.y = copyTarget.y;

                    this.cases[this.player1.x][this.player1.y] = this.player1;

                    this.player1.ancianWeapon = undefined;

                    this.currentPlayer = this.player1;
                    this.enemy = this.player2
                }
            }
            //this.turnSwitchTourButton(copyTarget);

        } else if (this.currentPlayer === this.player2) {

            const origin = this.player2;
            const targetCoordinate = target.id.split(",");
            const copyTarget = this.cases[targetCoordinate[0]][targetCoordinate[1]];

            if (copyTarget.name === "case vide"
                && this.player2.ancianWeapon === undefined
            ) {

                this.cases[origin.x][origin.y] = new Cases({ x: origin.x, y: origin.y, name: "case vide", cssClass: "caseVide", accessible: true });

                this.player2.x = copyTarget.x;
                this.player2.y = copyTarget.y;

                this.cases[this.player2.x][this.player2.y] = this.player2;

                this.currentPlayer = this.player2;
                this.enemy = this.player1

            }

            else {
                if (this.player2.ancianWeapon === undefined) {
                    // cases de départ si celle ci était à l'orogone une case vide et celle de destinaion un arme
                    this.cases[origin.x][origin.y] = new Cases({ x: origin.x, y: origin.y, name: "case vide", cssClass: "caseVide", accessible: true });
                    // l'arme actuellement équipée passe en ancienne arme

                    this.player2.ancianWeapon = this.player2.arme;

                    // on équipe la nouvelle arme
                    this.player2.arme = new Weapon({
                        name: copyTarget.name,
                        damage: copyTarget.damage,
                        accessible: true,
                        cssClass: copyTarget.cssClass,
                    });
                    //console.loglog("joueur 1 laisse tomber " + this.player2.ancianWeapon + " et équipe: " + this.player2.arme.name)
                    // nouvelle coordonées a player2
                    this.player2.x = copyTarget.x;
                    this.player2.y = copyTarget.y;

                    // placement de l'objet dans le tableau
                    this.cases[this.player2.x][this.player2.y] = this.player2;
                    // actualisation de currentPlayer
                    this.currentPlayer = this.player2;
                    this.enemy = this.player1

                } else {

                    this.cases[origin.x][origin.y] = new Weapon({
                        x: origin.x,
                        y: origin.y,
                        name: origin.ancianWeapon.name,
                        damage: origin.ancianWeapon.damage,
                        accessible: true,
                        cssClass: origin.ancianWeapon.cssClass,
                    });

                    this.player2.x = copyTarget.x;
                    this.player2.y = copyTarget.y;

                    this.cases[this.player2.x][this.player2.y] = this.player2;

                    this.player2.ancianWeapon = undefined;

                    this.currentPlayer = this.player2;
                    this.enemy = this.player1
                }
            }
        }

        this.onChange()


    }

    getCurrentPlayerPossibleCases() {

        //possibleCaseDown();
        //possibleCaseUp();
        //possibleCaseRight();
        //possibleCaseleft();
        this.possibleCases = [
            ...this.getPossibleCases(-1, 0),
            ...this.getPossibleCases(0, -1),
            ...this.getPossibleCases(1, 0),
            ...this.getPossibleCases(0, 1),
        ];
        //console.loglog(this.possibleCases)
        // refresh de possibleCase à chaque appel
        //possibleCase.all = [];

        // concatenation de toutes les cases dans un seul tableau
        //possibleCase.all = possibleCase.all.concat(possibleCase.right, possibleCase.left, possibleCase.down, possibleCase.up);

        // pour chaques elements du DOM correspndant, ajout de la classe "blue"
        if (this.possibleCases.length > 0) {
            this.possibleCases.forEach((element) => {
                //console.loginfo(element)
                let temp = document.getElementById(element.x + "," + element.y);

                temp.classList.add("blue");

                temp.addEventListener("click", (evt) => {

                    // 1. on calcule le nombre de pas fait a partir desid des cases
                    this.calculateMoveRest(evt.currentTarget);
                    // 2. échange des cases
                    this.switchCases(evt.currentTarget);
                    // 3. récupération des cases possibles en fonction du resultat de 1
                    this.getCurrentPlayerPossibleCases();



                });
            })
        }

        ////console.loginfo(possibleCase);
    }
    calculateMoveRest(cible) {
        //console.loglog(cible, this.player1, this.player2)
        // stockages des coordonnées de destination dans des variables et conversion en Number
        let targetCoordinate = cible.id.split(",");
        let targetX = Number(targetCoordinate[0]);
        let targetY = Number(targetCoordinate[1]);

        let compareXsup = Number(targetX) + 1;
        let compareXinf = Number(targetX) - 1;
        let compareYsup = Number(targetY) + 1;
        let compareYinf = Number(targetY) - 1;

        // conversion des valeurs de targetCoordinate en Number
        if (this.currentPlayer === this.player1) {
            if (this.player1.x === targetX) {

                let moveDecrement = this.player1.y - targetY;

                this.player1.moveCapacity = this.player1.moveCapacity - Math.abs(moveDecrement);// passage en valeure absolue

                this.currentPlayer = this.player1;

            } else if (this.player1.y === targetY) {

                let moveDecrement = this.player1.x - targetX;

                this.player1.moveCapacity = this.player1.moveCapacity - Math.abs(moveDecrement);

                // actualisation de "currentPlayer"
                this.currentPlayer = this.player1;
            }

            if ((compareXsup === this.player2.x && targetY === this.player2.y)
                || (compareXinf === this.player2.x && targetY === this.player2.y)
                || (targetX === this.player2.x && compareYsup === this.player2.y)
                || (targetX === this.player2.x && compareYinf === this.player2.y)
            ) {

                //console.loglog(targetX + " devient " + compareXsup);
                $('#switchTour').text("BASTON?!");

            } else {
                $('#switchTour').text("Fin de tour");
            }
        }
        if (this.currentPlayer === this.player2) {
            if (this.player2.x === targetX) {

                let moveDecrement = this.player2.y - targetY;

                this.player2.moveCapacity = this.player2.moveCapacity - Math.abs(moveDecrement); // passage en valeure absolue

                this.currentPlayer = this.player2;

            } else if (this.player2.y === targetY) {

                let moveDecrement = this.player2.x - targetX;

                this.player2.moveCapacity = this.player2.moveCapacity - Math.abs(moveDecrement);

                this.currentPlayer = this.player2;

            }

            if ((compareXsup === this.player1.x && targetY === this.player1.y)
                || (compareXinf === this.player1.x && targetY === this.player1.y)
                || (targetX === this.player1.x && compareYsup === this.player1.y)
                || (targetX === this.player1.x && compareYinf === this.player1.y)
            ) {

                //console.loglog(targetX + " devient " + compareXsup);
                $('#switchTour').text("BASTON?!");

            } else {
                $('#switchTour').text("Fin de tour");
            }
        }
    }
    getPossibleCases(...directions) {

        let result = [];
        let startPosition = {
            x: this.currentPlayer.x,
            y: this.currentPlayer.y
        }
        for (let i = 1; i <= this.currentPlayer.moveCapacity; i++) {
            const caseSelection = {
                x: startPosition.x + directions[0] * i,
                y: startPosition.y + directions[1] * i
            }
            let caseCandidate = this.getCaseByIndex(caseSelection.x, caseSelection.y)
            if (caseCandidate !== undefined) {
    
                if (caseCandidate.accessible === true) {
                    result.push(caseCandidate);
                }
                else{
                    break;
                }
            }
    
        }
        return result;
    }

    onChange() {
        this._onChange()
    }
};

class Battle {
    constructor({currentPlayer, enemy, displayManager}) {
        this.currentPlayer = currentPlayer;
        this.enemy = enemy;
        this.displayManager = displayManager;
    }
    attack() {

        // les deux joueurs choississent l'option "attaque"
        if ((this.currentPlayer.fightAction === "attack") && (this.enemy.fightAction === "attack")) {
            // on enregistre les dégat sur player 2
            this.enemy.hp = this.enemy.hp -= this.currentPlayer.arme.damage;

            alert(`${this.currentPlayer.name} attaque ${this.enemy.name} et lui inflige ${this.currentPlayer.arme.damage} de dégat!
            ${this.enemy.name} n'as plus que ${this.enemy.hp}hp!`);

            // on enregistre les degats sur player 11
            this.currentPlayer.hp = this.currentPlayer.hp -= this.enemy.arme.damage;

            alert(`${this.enemy.name} attaque aussi ${this.currentPlayer.name} et lui inflige ${this.enemy.arme.damage} de dégat!
                  ${this.currentPlayer.name} n'as plus que ${this.currentPlayer.hp}hp!`);


            // refresh des fiches personnages avec les nouvelles données

            this.fightBoard();

        }
        // Jouer 1 defend et joueur 2 attaque
        else if ((this.currentPlayer.fightAction === "defend") && (this.enemy.fightAction === "attack")) {
            this.currentPlayer.hp = this.currentPlayer.hp -= (this.enemy.arme.damage * 0.5);

            alert(`${this.currentPlayer.name} se defend sur l'attaque de ${this.enemy.name}
                    ${this.currentPlayer.name} diminue les dégat de moitié et n'a plus que ${this.currentPlayer.hp}hp!`);


            this.fightBoard();
        }
        // joueur 1 attaque et joueur 2 defend

        else if ((this.currentPlayer.fightAction === "attack") && (this.enemy.fightAction === "defend")) {
            this.enemy.hp = this.enemy.hp -= (this.currentPlayer.arme.damage * 0.5);

            alert(`${this.enemy.name} se defend sur l'attaque de ${this.currentPlayer.name}
                    ${this.enemy.name} diminue les dégat de moitié et n'a plus que ${this.enemy.hp}hp!`);

            this.fightBoard();

        }
        else {
            alert("si tout le monde defend, ca va durer longtemps");
            // on reset les valeurs des boutons

            this.fightBoard();
        }

        // on reset les valeurs des boutons
        this.currentPlayer.fightAction = undefined;
        this.enemy.fightAction = undefined;
        this.fightScenario();

    }

    fightScenario() {

        if (this.currentPlayer.hp > 0 && this.enemy.hp > 0) {


            if (this.currentPlayer.fightAction === undefined) {
                this.fightBoard();
                this.fightButtonsActivate(this.currentPlayer);


            } else if (this.currentPlayer.fightAction !== undefined
                && this.enemy.fightAction === undefined
            ) {
                this.fightBoard();
                this.fightButtonsActivate(this.enemy);

            } else if (this.currentPlayer.fightAction !== undefined
                && this.enemy.fightAction !== undefined) {
                this.attack();

            }

        } else if (this.currentPlayer.hp <= 0 || this.enemy.hp <= 0) {

            this.currentPlayer.hp < this.enemy.hp ? alert(this.enemy.name + " VAINQUEUR!") : alert(this.currentPlayer.name + " VAINQUEUR!");
            document.location.reload(true);


        }

    }

    fightBoard() {

        $('#fiche_player1').remove();
        $('#fiche_player2').remove();
        if ($('.imgCombat') !== undefined) {
            $('.imgCombat').remove();
        }
        // les deux fiches personnage occupent tout l'écran de jeu
        $('#gameSpace').append('<div id="fiche_player1" class="fichesPlayers" ></div>');
        $('#gameSpace').append('<img src="./img/imgCombat.jpg" class="imgCombat">');
        $('#gameSpace').append('<div id="fiche_player2" class="fichesPlayers"></div>');

        this.displayManager.fichePerso("fiche_player1", this.currentPlayer);
        this.displayManager.fichePerso("fiche_player2", this.enemy)

        const perso1 = document.getElementById("fiche_player1");
        const perso2 = document.getElementById("fiche_player2");

        perso1.style.width = "30%";
        perso2.style.width = "30%";

        this.createAtkDefInput(this.currentPlayer, "fiche_player1");
        this.createAtkDefInput(this.enemy, "fiche_player2");
    }

    createAtkDefInput(player, idFichePlayer) {
        // création de la div qui contiendra les input attk et def.
        const buttonsAttckDef = document.createElement("div");
        buttonsAttckDef.id = player.name + "_FightButtons";
        buttonsAttckDef.classList.add("divFightButtons");
        document.getElementById(idFichePlayer).appendChild(buttonsAttckDef);

        // création du bouton attack dans la fiche du joueur selectionné
        const attack = document.createElement("button");
        attack.id = player.name + "_Attack";
        attack.textContent = "Attaquer";
        attack.classList.add("fightsButton");
        document.getElementById(buttonsAttckDef.id).appendChild(attack);

        // création du bouton defend dans dans la fiche du joueur selectionné
        const defend = document.createElement("button");
        defend.id = player.name + "_Defend";
        defend.textContent = "Défendre";
        defend.classList.add("fightsButton");
        document.getElementById(buttonsAttckDef.id).append(defend);
    }
    // lancement de l'interface de combat

    letsFight() {
        $('#board').remove();
        $('#border_Button').remove();
        //document.getElementById("gameSpace").removeChild(document.getElementById("board"));
        this.fightBoard();
        this.fightScenario();
    }

    fightButtonsActivate(player) {
        const attackButtonPlayer = document.getElementById(player.name + "_Attack");
        attackButtonPlayer.style.backgroundColor = "rgb(242, 74, 74 )";


        attackButtonPlayer.addEventListener("click", () => {
            player.fightAction = "attack";
            // test
            //console.loglog("action de " + player.name + ": " + player.fightAction);
            this.fightScenario();
        });

        const defendButtonPlayer = document.getElementById(player.name + "_Defend");
        defendButtonPlayer.style.backgroundColor = "rgb( 74, 181, 242 )";

        defendButtonPlayer.addEventListener("click",  () => {
            player.fightAction = "defend";
            // test
            //console.loglog("action de " + player.name + ": " + player.fightAction);
            this.fightScenario();
        });
    }
}
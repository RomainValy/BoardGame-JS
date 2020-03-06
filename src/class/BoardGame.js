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
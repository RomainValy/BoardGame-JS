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

class DisplayManager {
    constructor({boardGame}) {
        this.boardGame = boardGame
        this.boardGame._onChange = () => this.refreshBoardGame()
        this.gameSpaceGenerator();
        this.boardGenerator();
        this.selectPseudoPlayers.bind(this)();
        this.fichePerso.bind(this)("fiche_player1", this.boardGame.player1);
        this.fichePerso.bind(this)("fiche_player2", this.boardGame.player2);
        this.switchTourButton()
    }
    
    gameSpaceGenerator(){
        // div qui contiendra l'interface de jeu et les fiches personnages
        $("h1").after('<div id="gameSpace"></div>');
    }
        
    boardGenerator() {
        
        // determine la taille des cases en fonction du nombre de ligne et colones souhaitées
        let a = 100 / (this.boardGame.columns);
        let b = 100 / (this.boardGame.lines);

        $('#gameSpace').append('<div id="board"></div>');
        $('#board').addClass(this.boardGame.cssClass);;

        for (let x = 0; x < this.boardGame.lines; x++) {
            // determine la taille des cases en fonction du nombre de ligne et colones souhaitées
            
            board.style.gridTemplateColumns += `${a}%`;
            board.style.gridTemplateRows += `${b}%`;

            for (let y = 0; y < this.boardGame.columns; y++) {

                $('#board').append('<span id="'+ this.boardGame.cases[x][y].x +','
                                    + this.boardGame.cases[x][y].y 
                                    +'" class='+this.boardGame.cases[x][y].cssClass+'></span>');
            }
            
        }
        
        $('#board').before('<div id="fiche_player1" class="fichesPlayers" ></div>')
        $('#board').after('<div id="fiche_player2" class="fichesPlayers"></div>')
    }
    
    // cases dans div "joueur1" et div "joueur2";

    fichePerso(id, player) {
        

        // refresh de la fiche perso
        $('#'+id).empty();
       
        //insertion du nom du perso
        $('#'+id).append('<h2 id="'+player.name+'">'+player.name+'</h2>')
                
        // les HP
        $('#'+id).append('<p> HP: '+player.hp+'</p>');

               
        //insertion de l'arme et des dégats
        
        $('#'+id).append('<p> Votre arme ' + player.name + ':<br>' + player.arme.name +'</p>');
        //$('#'+player.name+'-'+player.arme.name).text("Votre arme " + player.name + ": " + player.arme.name +"(+" + player.arme.damage +")");
        
        $('#'+id).append('<p>Dégats: '+ player.arme.damage+'</p>')
            
    };
    
    switchTourButton(){
        // div du bouton de changement de tour

        const divSwitchTourInput = document.createElement("div");
        divSwitchTourInput.id = "border_Button";
        divSwitchTourInput.classList.add("borderButton");
        $('#gameSpace').after(divSwitchTourInput);

        // 
        const switchTourInput = document.createElement("button");
        switchTourInput.id = "switchTour";
        switchTourInput.type = "button";
        
        switchTourInput.textContent = "Fin de tour";
        switchTourInput.classList.add("button");
        $('#border_Button').append(switchTourInput);

        // --------- ajout de l'evenement "CHANGEMENT DE TOUR" ----------
        switchTourInput.addEventListener("click", () => {
            
            // si les joueurs sont cote à cote, l'evenement active l'interface de combat
            if ((this.boardGame.cases[this.boardGame.currentPlayer.x + 1][this.boardGame.currentPlayer.y] !== undefined
                && this.boardGame.cases[this.boardGame.currentPlayer.x + 1][this.boardGame.currentPlayer.y] === this.boardGame.cases[this.boardGame.enemy.x][this.boardGame.enemy.y])

            || (this.boardGame.cases[this.boardGame.currentPlayer.x - 1][this.boardGame.currentPlayer.y] !== undefined
                && this.boardGame.cases[this.boardGame.currentPlayer.x - 1][this.boardGame.currentPlayer.y] === this.boardGame.cases[this.boardGame.enemy.x][this.boardGame.enemy.y])

            || ( this.boardGame.cases[this.boardGame.currentPlayer.x][this.boardGame.currentPlayer.y + 1] !== undefined
                && this.boardGame.cases[this.boardGame.currentPlayer.x][this.boardGame.currentPlayer.y + 1] === this.boardGame.cases[this.boardGame.enemy.x][this.boardGame.enemy.y])

            || ( this.boardGame.cases[this.boardGame.currentPlayer.x][this.boardGame.currentPlayer.y - 1] !== undefined
                && this.boardGame.cases[this.boardGame.currentPlayer.x][this.boardGame.currentPlayer.y - 1] === this.boardGame.cases[this.boardGame.enemy.x][this.boardGame.enemy.y])
            ){
                
                new Battle({
                    currentPlayer: this.boardGame.currentPlayer,
                    enemy: this.boardGame.enemy,
                    displayManager: this,
                     
                }).letsFight();
            
            } else{
                // sinon, inversion des joueurs
                if (this.boardGame.currentPlayer === this.boardGame.player1){
                    this.boardGame.player2.moveCapacity = 3;
                    this.boardGame.currentPlayer = this.boardGame.player2;
                    this.boardGame.enemy = this.boardGame.player1;
            
                }
                else{
                    this.boardGame.player1.moveCapacity = 3;
                    this.boardGame.currentPlayer = this.boardGame.player1;
                    this.boardGame.enemy = this.boardGame.player2;
                }
                
                this.refreshBoardGame();
                this.boardGame.getCurrentPlayerPossibleCases();
            }        
        });

    } 
    
    selectPseudoPlayers() {
        const pseudoJ1 = prompt("Joueur 1, quelle sera votre nom?")
        if(pseudoJ1 === null || pseudoJ1 === ""){
            this.boardGame.player1.name = "Joueur 1"
            }else{
                this.boardGame.player1.name = pseudoJ1;
            }
        
        const pseudoJ2 = prompt("Joueur 2, quelle sera votre nom?");
        if(pseudoJ2 === null || pseudoJ2 === ""){
            this.boardGame.player2.name = "Joueur 2"
            }else{
                if(pseudoJ1 === pseudoJ2){
                    this.boardGame.player1.name = pseudoJ1+"1";
                    this.boardGame.player2.name = pseudoJ2+"2";
                }else{
                    this.boardGame.player2.name = pseudoJ2; 
                }
                
            }
        
    }

    refreshBoardGame(){
        $('#board').remove();
        $('#fiche_player1').remove();
        $('#fiche_player2').remove();
        this.boardGenerator();
        this.fichePerso("fiche_player1", this.boardGame.player1);
        this.fichePerso("fiche_player2", this.boardGame.player2);
    }
}

// lancement de l'interface de jeu

//gameStart = () => {
//    displayManager.gameSpaceGenerator();
//    displayManager.boardGenerator();
//    displayManager.selectPseudoPlayers();
//    displayManager.fichePerso("fiche_player1", player1);
//    displayManager.fichePerso("fiche_player2", player2);
//    displayManager.switchTourButton()
//    getCurrentPlayerPossibleCases();
//
//}
//
//// lancement de partie avec board et players déjà pré-configurés
//
//gameStart();






var app = {
  init: function () {
    console.log('Jeu de mémoire : APP INIT');

    // Déclaration du tableau qui contient toutes les Cards
    app.allCards = [];

    // Déclaration du tableau qui contient les position du background des images cliquées du joueur
    app.allPosition = [];

    // Déclaration du tableau qui contient les index des images cliquées du joueur
    app.allIndex = [];

    // Variable compteur de carte retournées
    app.returnCardCount = 0;

    // Variable contenant le nombre de paires trouvées
    app.findCards = 0;

    // Variable contenant le nombre de cartes total selon la difficulté
    app.difficultyIndex = 28;

    // Variable contenant le nombre de paires à trouver
    app.numberCardsToFind = 14;
    
    // Variable contenant le temps total selon la difficulté
    app.timerValue = 60;
    
    // Variable contenant le temps de progression pour la progress bar selon la difficulté
    app.timerProgress = 60000;

    /********* MODE HARDCORE SETUP *********/

    if (localStorage.getItem('difficulty') === 'hard') {
      $('.board').addClass('hard-mode');
      $('#progressbar').addClass('hard-mode');
      $('.progress-label').addClass('hard-mode');
      app.difficultyIndex = 36;
      app.numberCardsToFind = 18;
      app.timerValue = 90;
      app.timerProgress = 90000;
    }

    /********* MODE HARDCORE SETUP ********/
  
    // Boucle qui crée les Cards (On se sert de la valeur de l'index pour récupérer une position avec getPosition)
    for (app.index = 0; app.index < app.difficultyIndex; app.index++) {
      app.createCard();
    }

    // On mélange le tableau avant de l'insérer dans le html (Commenté pour auto win en ligne)
    app.shuffleAllCards(app.allCards);
  
    // Rattache le tableau de Cards à la div#board du DOM
    $('.board').append(app.allCards);

    console.log('Game Ready');

    // Lance la partie 5 secondes après le chargement du DOM
    app.getPogressTimer();
    app.playGame();
  },
  /* Lance le jeu */
  playGame: function () {
    // Ecouteur du click unique (.one) sur div.the-card pour retourner la carte
    $('div.the-card').one('click', app.selectCard);

  },
  /* Lorsque l'on clique sur une carte */
  selectCard: function (evt) {

    // Incrémente de 1 à chaque fois que l'on retourne une carte
    app.returnCardCount++;

    // Variable de l'événement
    app.$currentCard = $(evt.currentTarget);
    app.$currentCardIndex = $(evt.currentTarget).index('div.the-card');
    app.$currentCardPosition = $(evt.currentTarget).children().children('.image').css('background-position-y');

    // Push dans un tableau les différentes valeurs récupérées
    app.allPosition.push(app.$currentCardPosition);
    app.allIndex.push(app.$currentCardIndex);

    // Si la class de l'événement est the-card
    if (app.$currentCard.hasClass('the-card')) {
      // Ajout de la class .active
      app.$currentCard.addClass('active');
    }

    // Si le nombre de carte retourné est pair alors on vérifies si elles sont identiques sinon on attend un autre clic
    if (app.returnCardCount % 2 === 0) {
      app.checkCards();
    }

  },
  /* Vérification des cartes sélectionnées */
  checkCards: function () {
    // Si les cartes qui viennent d’être retournées ont la même position de l'image background la conditon est vérifiée
    if (app.allPosition[app.allPosition.length - 1] === app.allPosition[app.allPosition.length - 2]) {
      // Incrémente de 1 le nombre de pairs trouvés
      app.findCards++;
      // Si le nombre de pairs est égal à 14 alors on gagne
      if (app.findCards === app.numberCardsToFind) {
        // Coupe le listener de clic
        $('div.the-card').off('click');
        // Ce délai avant de lancer l'alert de victoire permet l'affichage de la dernière carte
        setTimeout(app.victoryWin, 500);
      } else {
        // Le jeu continue tant que l'on trouve pas les bonnes paires
        app.playGame;
      }
    } else {
      // Coupe le listener de clic
      $('div.the-card').off('click');
      // Les cartes restent affichées 1 seconde avant qu'elles ne soient cachées à nouveau avec la méthode hideFalseCards
      setTimeout(app.hideFalseCards, 1000);
      // Le jeu est repart au bout de 1 seconde, le clic sera de nouveau autorisé
      setTimeout(app.playGame, 1000);
    }
  },
  /* Quand on gagne */
  victoryWin: function () {
    // Variable pour le tableau des scores
    var gameResult = 'Win';
    var gameNumber = localStorage.length + 1;
    var bestTime = 60 - app.timeLeft;

    // Ce qui sera affiché pour le tableau des scores
    var gameWin = '<tr>';
    gameWin += '<td>' + gameNumber + '</td>';
    gameWin += '<td>' + gameResult + '</td>';
    gameWin += '<td>' + app.returnCardCount + '</td>';
    gameWin += '<td>' + app.findCards + '</td>';
    gameWin += '<td>' + bestTime + ' secondes</td>';
    gameWin += '</tr>';

    // On stock dans le local storage la game et on incrémente la clé de 1 pour ne pas écraser les parties précédentes
    localStorage.setItem(localStorage.length + 1, gameWin);

    // Lance une alert lorsque l'on a gagné
    window.alert('Vous avez gagné en retournant : ' + app.returnCardCount + ' cartes !');
    window.location.href = 'accueil.html';

  },
  /* Quand on est mauvais */
  defeatLoss: function () {
    // Variable pour le tableau des scores
    var gameResult = 'Loose';
    var gameNumber = localStorage.length + 1;
    var gameTime = 'Hum... Zero';

    // Ce qui sera affiché pour le tableau des scores
    var gameLoss = '<tr>';
    gameLoss += '<td>' + gameNumber + '</td>';
    gameLoss += '<td>' + gameResult + '</td>';
    gameLoss += '<td>' + app.returnCardCount + '</td>';
    gameLoss += '<td>' + app.findCards + '</td>';
    gameLoss += '<td>' + gameTime + '</td>';
    gameLoss += '</tr>';

    // On stock dans le local storage la game et on incrémente la clé de 1 pour ne pas écraser les parties précédentes
    localStorage.setItem(localStorage.length + 1, gameLoss);

    // Lance une alert lorsque l'on a gagné
    window.alert('Vous avez perdu même en retournant : ' + app.returnCardCount + ' cartes !');
    window.location.href = 'accueil.html';

  },
  /* Quand on ne trouve pas la bonne paire */
  hideFalseCards: function () {

    // Sélectionne dans le tableau allCards les deux dernières div.card cliquées via la valeur de l'index récupérer lors du clic
    var $firstClickedCard = app.allCards[app.allIndex[app.allIndex.length - 2]];
    var $secondClickedCard = app.allCards[app.allIndex[app.allIndex.length - 1]];

    // Sélectionne la div.the-card et enlève la class .active
    $firstClickedCard.removeClass('active');

    // Sélectionne la div.the-card et enlève la class .active
    $secondClickedCard.removeClass('active');
  },
  /* Création de carte */
  createCard: function () {

    // Création avec Jquery d'une div.the-card avec deux enfants .hide et .image
    app.$card = $('<div class="the-card"><div class="shadow card"><div class="hide"></div><div class="image face"></div></div></div>');

    // Appel de la méthode pour définir position background Image
    app.getbackgroundImageCard();

    // Push dans le tableau la card créée
    app.allCards.push(app.$card);
  },
  /* Récupère une image de fruits */
  getbackgroundImageCard: function () {
    // Variable qui contient .image, enfant de l'enfant à l'index 1 de l'objet app.$card
    var $imageCard = app.$card.children().children('.image');

    // Contient la propriété et la valeur CSS à appliquer avec la méthode getPosition
    var backgroundImagePosition = {
      'background-position': '0 -' + app.getPosition(app.index) + 'px',
    };

    // Applique sur la div.image la propriété CSS backgroundImagePosition
    $imageCard.css(backgroundImagePosition);
  },
  /* Récupère une position pour l'image de fruits */
  getPosition: function (indexNumber) {
    // On stock les possibilités de position y pour le background de la div.image
    var position = [0, 0, 100, 100, 200, 200, 300, 300, 400, 400, 500, 500, 600, 600, 700, 700, 800, 800, 900, 900, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1300, 1400, 1400, 1500, 1500, 1600, 1600, 1700, 1700];
    // La fonction retourne la position y à l'index défini par le paramètre
    return position[indexNumber];
  },
  /* Mélangeur de tableau (#GRÀCE À LINK@https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array) */
  shuffleAllCards: function (allCards) {
    // On défini les variable pour le mélange
    var randNbr;
    var shuffleNbr;
    var indexNbr;
    // Boucle qui mélange l'index du tableau passé en parametre
    for (indexNbr = allCards.length - 1; indexNbr > 0; indexNbr--) {
      randNbr = Math.floor(Math.random() * (indexNbr + 1));
      shuffleNbr = allCards[indexNbr];
      allCards[indexNbr] = allCards[randNbr];
      allCards[randNbr] = shuffleNbr;
    }
    // La fonction retourne le tableau mélangé
    return allCards;
  },
  /* ProgressBar customisé (#GRÀCE À Jquery UI LINK@https://api.jqueryui.com/progressbar/) */
  getPogressTimer: function () {

    $(function () {
      var progressbar = $('#progressbar');
      var progressLabel = $('.progress-label');

      // Valeur initialisé selon la difficulté choisie
      progressbar.progressbar({
        value: app.timerValue,
        max: app.timerValue,

        // un affichage supplémentaire et dynamique du temps restant
        change: function () {
          progressLabel.text(progressbar.progressbar('value') + ' secondes restantes !');
        },

        // au démarrage du jeu on envoi un text go !!!
        complete: function () {
          if (progressbar.progressbar('value') === app.timerValue) {
            progressLabel.text(' GOOOOO !!!! ');
          }
        }
      });

      function progress() {
        app.timeLeft = progressbar.progressbar('value') || 0;
        var $customProgressBar = $('.ui-widget-header');

        // Animation supplémentaire pour une barre plus sympa
        $customProgressBar.animate({ 'width': '0%' }, app.timerProgress);

        progressbar.progressbar('value', app.timeLeft - 1);

        // Condition de temps sur le changment de couleur de la barre
        if (app.timeLeft > 45) {
          $customProgressBar.css({ 'background': 'LightGreen' });
        } else if (app.timeLeft > 30) {
          $customProgressBar.css({ 'background': 'Yellow' });
        } else if (app.timeLeft > 15) {
          $customProgressBar.css({ 'background': 'Orange' });
        } else {
          $customProgressBar.css({ 'background': 'Red' });
        }

        // Une progression toutes les secondes et à la défaite on laisse 5 ms.
        if (app.timeLeft > 0) {
          setTimeout(progress, 1000);
        } else if (progressbar.progressbar('value') === 0) {
          setTimeout(app.defeatLoss(), 500);
          progressLabel.text('Game Over !');
        }
      }

      setTimeout(progress, 500);
    });
  },
};

// DOM Loading
$(app.init);

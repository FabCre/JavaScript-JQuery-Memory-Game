var app = {
  init: function() {
    console.log('Jeu de mémoire : RESULTAPP INIT');

 
    app.$easyGame = $('button#easy-game').on('click', app.setDifficulty);
    app.$hardGame = $('button#hard-game').on('click', app.setDifficulty);
    
    console.log(localStorage);

    // Ecoute le click pour reset la table des scores
    $( '#clear-score' ).on('click', app.clearScore);
  
    // Affiche le tableau de Score à partir du localStorage
    app.scoreTable();
  },

  /* Reset de la table des scores */
  clearScore: function () {
    localStorage.clear();
  },

  /* Génère le tableau des scores des parties effectuées */
  scoreTable: function () {
    for (var index = 1; index < localStorage.length + 1; index++) {
      $( '#score-board' ).append(localStorage.getItem(index));
    }
  },

  setDifficulty: function (evt) {

    var difficulty = $(evt.currentTarget).val();

    if (difficulty === 'easy') {
      localStorage.setItem( 'difficulty', 'easy');
    } else if (difficulty === 'hard') {
      localStorage.setItem('difficulty', 'hard');
    }
  },

};

// DOM Loading
$(app.init);

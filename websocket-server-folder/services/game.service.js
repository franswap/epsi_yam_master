const TURN_DURATION = 30;

const DECK_INIT = {
  dices: [
    { id: 1, value: "", locked: true },
    { id: 2, value: "", locked: true },
    { id: 3, value: "", locked: true },
    { id: 4, value: "", locked: true },
    { id: 5, value: "", locked: true },
  ],
  rollsCounter: 1,
  rollsMaximum: 3,
};

const CHOICES_INIT = {
  isDefi: false,
  isSec: false,
  idSelectedChoice: null,
  availableChoices: [],
};

const GRID_INIT = [
  [
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: null, canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
    { viewContent: "6", id: "brelan6", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    { viewContent: "Carré", id: "carre", owner: null, canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "Yam", id: "yam", owner: null, canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: null, canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "6", id: "brelan6", owner: null, canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    { viewContent: "Carré", id: "carre", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: null, canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
  ],
];

const ALL_COMBINATIONS = [
  { value: "Brelan1", id: "brelan1" },
  { value: "Brelan2", id: "brelan2" },
  { value: "Brelan3", id: "brelan3" },
  { value: "Brelan4", id: "brelan4" },
  { value: "Brelan5", id: "brelan5" },
  { value: "Brelan6", id: "brelan6" },
  { value: "Full", id: "full" },
  { value: "Carré", id: "carre" },
  { value: "Yam", id: "yam" },
  { value: "Suite", id: "suite" },
  { value: "≤8", id: "moinshuit" },
  { value: "Sec", id: "sec" },
  { value: "Défi", id: "defi" },
];

const GAME_INIT = {
  gameState: {
    currentTurn: "player:1",
    timer: TURN_DURATION,
    player1Score: 0,
    player2Score: 0,
    player1Pawns: 12,
    player2Pawns: 12,
    winner: null,
    grid: [],
    choices: {},
    deck: {},
    bot: {
      hasBot: false,
      difficulty: null,
    },
  },
};

const GameService = {
  init: {
    // Init first level of structure of 'gameState' object
    gameState: () => {
      const game = { ...GAME_INIT };
      game["gameState"]["timer"] = TURN_DURATION;
      game["gameState"]["deck"] = { ...DECK_INIT };
      game["gameState"]["choices"] = { ...CHOICES_INIT };
      game["gameState"]["grid"] = [...GRID_INIT];
      return game;
    },
    deck: () => {
      return { ...DECK_INIT };
    },
    choices: () => {
      return { ...CHOICES_INIT };
    },
    grid: () => {
      return { ...GRID_INIT };
    },
  },

  timer: {
    getTurnDuration: () => {
      return TURN_DURATION;
    },
  },

  dices: {
    roll: (dicesToRoll) => {
      const rolledDices = dicesToRoll.map((dice) => {
        if (dice.value === "") {
          // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return {
            id: dice.id,
            value: newValue,
            locked: false,
          };
        } else if (!dice.locked) {
          // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return {
            ...dice,
            value: newValue,
          };
        } else {
          // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
          return dice;
        }
      });
      return rolledDices;
    },
    lockEveryDice: (dicesToLock) => {
      const lockedDices = dicesToLock.map((dice) => ({
        ...dice,
        locked: true,
      }));
      return lockedDices;
    },
    unlockEveryDice: (dicesToUnlock) => {
      const unlockedDices = dicesToUnlock.map((dice) => ({
        ...dice,
        locked: false,
      }));
      return unlockedDices;
    },
  },

  send: {
    forPlayer: {
      // Return conditionnaly gameState custom objet for player views
      gameViewState: (playerKey, game) => {
        return {
          inQueue: false,
          inGame: true,
          idPlayer:
            playerKey === "player:1"
              ? game.player1Socket.id
              : game.player2Socket.id,
          idOpponent:
            playerKey === "player:1"
              ? game.player2Socket.id
              : game.player1Socket.id,
        };
      },

      queueViewState: () => {
        return {
          inQueue: true,
          inGame: false,
        };
      },
      gameTimer: (playerKey, gameState) => {
        const { currentTurn, timer } = gameState;

        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerTimer = currentTurn === playerKey ? timer : 0;
        const opponentTimer = currentTurn === playerKey ? 0 : timer;
        return { playerTimer, opponentTimer };
      },
      gamePawns: (playerKey, gameState) => {
        const { player1Pawns, player2Pawns } = gameState;

        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerPawns =
          playerKey === "player:1" ? player1Pawns : player2Pawns;
        const opponentPawns =
          playerKey === "player:1" ? player2Pawns : player1Pawns;
        return { playerPawns, opponentPawns };
      },
      gameScore: (playerKey, gameState) => {
        const { player1Score, player2Score } = gameState;

        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerScore =
          playerKey === "player:1" ? player1Score : player2Score;
        const opponentScore =
          playerKey === "player:1" ? player2Score : player1Score;
        return { playerScore, opponentScore };
      },
      deckViewState: (playerKey, gameState) => {
        const { currentTurn, deck } = gameState;

        const deckViewState = {
          displayPlayerDeck: currentTurn === playerKey,
          displayOpponentDeck: currentTurn !== playerKey,
          displayRollButton: deck.rollsCounter <= deck.rollsMaximum,
          rollsCounter: deck.rollsCounter,
          rollsMaximum: deck.rollsMaximum,
          dices: deck.dices,
        };
        return deckViewState;
      },
      choicesViewState: (playerKey, gameState) => {
        const { currentTurn, choices } = gameState;

        const choicesViewState = {
          displayChoices: true,
          canMakeChoice: playerKey === currentTurn,
          idSelectedChoice: choices.idSelectedChoice,
          availableChoices: choices.availableChoices,
        };
        return choicesViewState;
      },
      gridViewState: (playerKey, gameState) => {
        const { currentTurn, choices, grid } = gameState;

        return {
          displayGrid: true,
          canSelectCells:
            playerKey === currentTurn && choices.availableChoices.length > 0,
          grid,
        };
      },
      // Créer le résumé de la partie
      gameSummary: (playerKey, game) => {
        const { player1Socket, player2Socket } = game;
        const { winner, player1Score, player2Score } = game.gameState;

        let isOpponentDisconnected = !player1Socket.connected;
        if (!player2Socket.isBot) {
          isOpponentDisconnected = !player2Socket.connected;
        }

        const isWinner = playerKey === winner && !isOpponentDisconnected;
        const isDraw = winner === null && !isOpponentDisconnected;
        const isLoser = !isWinner && !isDraw && !isOpponentDisconnected;

        const playerScore =
          playerKey === "player:1" ? player1Score : player2Score;
        const opponentScore =
          playerKey === "player:1" ? player2Score : player1Score;

        return {
          isOpponentDisconnected,
          isWinner,
          isLoser,
          isDraw,
          playerScore,
          opponentScore,
        };
      },
    },
  },

  choices: {
    findCombinations: (dices, isDefi, isSec) => {
      const allCombinations = ALL_COMBINATIONS;
      // Tableau des objets 'combinations' disponibles parmi 'ALL_COMBINATIONS'
      const availableCombinations = [];

      const counts = Array(7).fill(0); // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
      let hasPair = false; // check: paire
      let threeOfAKindValue = null; // check: valeur brelan
      let hasThreeOfAKind = false; // check: brelan
      let hasFourOfAKind = false; // check: carré
      let hasFiveOfAKind = false; // check: yam
      let hasStraight = false; // check: suite
      let sum = 0; // sum of dices
      let isLessThanEqual8 = false; // check: ≤8

      // Compter le nombre de dés de chaque valeur et calculer la somme
      for (let i = 0; i < dices.length; i++) {
        const diceValue = parseInt(dices[i].value);
        counts[diceValue]++;
        sum += diceValue;
      }

      // Vérifier les combinaisons possibles
      for (let i = 1; i <= 6; i++) {
        if (counts[i] === 2) {
          hasPair = true;
        } else if (counts[i] === 3) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
        } else if (counts[i] === 4) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
          hasFourOfAKind = true;
        } else if (counts[i] === 5) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
          hasFourOfAKind = true;
          hasFiveOfAKind = true;
        }
      }
      if (counts.slice(1).join("").includes("11111")) hasStraight = true; // Suite
      if (sum <= 8) isLessThanEqual8 = true; // ≤8

      // Retourner les combinaisons possibles via leur ID
      allCombinations.forEach((combination) => {
        if (
          (combination.id.startsWith("brelan") &&
            hasThreeOfAKind &&
            parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
          (combination.id === "full" && hasPair && hasThreeOfAKind) ||
          (combination.id === "carre" && hasFourOfAKind) ||
          (combination.id === "yam" && hasFiveOfAKind) ||
          (combination.id === "suite" && hasStraight) ||
          (combination.id === "moinshuit" && isLessThanEqual8) ||
          (combination.id === "defi" && isDefi)
        ) {
          availableCombinations.push(combination);
        }
      });

      const notOnlyBrelan = availableCombinations.some(
        (combination) => !combination.id.includes("brelan")
      );

      if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
        availableCombinations.push(
          allCombinations.find((combination) => combination.id === "sec")
        );
      }

      return availableCombinations;
    },
  },

  grid: {
    // La grille retournée doit avoir le flag 'canBeChecked' de toutes les cases de la 'grid' à 'false'
    resetCanBeCheckedCells: (grid) => {
      const updatedGrid = grid.map((row) =>
        row.map((cell) => ({ ...cell, canBeChecked: false }))
      );
      return updatedGrid;
    },

    // La grille retournée doit avoir toutes les 'cells' qui ont le même 'id' que le 'idSelectedChoice' à 'canBeChecked: true'
    updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
      const updatedGrid = grid.map((row) =>
        row.map((cell) => {
          if (cell.id === idSelectedChoice && cell.owner === null) {
            return { ...cell, canBeChecked: true };
          } else {
            return cell;
          }
        })
      );

      return updatedGrid;
    },

    findCellCanBeChecked: (grid) => {
      for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          if (cell.canBeChecked) {
            return { cell, rowIndex: i, cellIndex: j };
          }
        }
      }
      return null;
    },

    // La grille retournée doit avoir avoir la case selectionnée par le joueur du tour en cours à 'owner: currentTurn'
    // Nous avons besoin de rowIndex et cellIndex pour différencier les deux combinaisons similaires du plateau
    selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
      const updatedGrid = grid.map((row, rowIndexGrid) =>
        row.map((cell, cellIndexGrid) => {
          if (
            cell.id === idCell &&
            cell.owner === null &&
            rowIndex === rowIndexGrid &&
            cellIndex === cellIndexGrid
          ) {
            return { ...cell, owner: currentTurn };
          } else {
            return cell;
          }
        })
      );

      return updatedGrid;
    },
  },

  utils: {
    // Return game index in global games array by id
    findGameIndexById: (games, idGame) => {
      for (let i = 0; i < games.length; i++) {
        if (games[i].idGame === idGame) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },

    findGameIndexBySocketId: (games, socketId) => {
      for (let i = 0; i < games.length; i++) {
        if (
          games[i].player1Socket.id === socketId ||
          games[i].player2Socket.id === socketId
        ) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },

    findGameBySocketId: (games, socketId) => {
      for (let i = 0; i < games.length; i++) {
        if (
          games[i].player1Socket.id === socketId ||
          games[i].player2Socket.id === socketId
        ) {
          return games[i]; // Retourne le jeu si le socket est trouvé
        }
      }
      return null;
    },

    findDiceIndexByDiceId: (dices, idDice) => {
      for (let i = 0; i < dices.length; i++) {
        if (dices[i].id === idDice) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },

    deleteGame: (games, game) => {
      const gameIndex = games.indexOf(game);
      if (gameIndex > -1) games.splice(gameIndex, 1);
      return games;
    },

    removePlayerFromQueue: (queue, playerSocket) => {
      const playerIndex = queue.indexOf(playerSocket);
      if (playerIndex > -1) queue.splice(playerIndex, 1);
      return queue;
    },

    calculateScore: (playerKey, grid) => {
      function calculateAlignment(
        grid,
        rowIndex,
        columIndex,
        playerKey,
        nbAlign,
        nbMaxAlign
      ) {
        if (grid[rowIndex][columIndex].owner === playerKey) {
          nbAlign++;
          if (nbAlign > nbMaxAlign) nbMaxAlign = nbAlign;
        } else nbAlign = 0;

        return [nbAlign, nbMaxAlign];
      }

      function calculatePoint(nbMaxAlign) {
        let score = 0;
        if (nbMaxAlign === 3) score = 1;
        else if (nbMaxAlign === 4) score = 2;
        else if (nbMaxAlign === 5) winner = playerKey;
        return score;
      }

      function calculateScoreRowOrColumn(direction) {
        let score = 0;
        let nbRows = grid.length;
        let nbCols = grid[0].length;

        for (let i = 0; i < (direction === "row" ? nbRows : nbCols); i++) {
          let nbAlign = 0;
          let nbMaxAlign = 0;

          for (let j = 0; j < (direction === "row" ? nbCols : nbRows); j++) {
            let rowIndex = direction === "row" ? i : j;
            let columnIndex = direction === "row" ? j : i;
            [nbAlign, nbMaxAlign] = calculateAlignment(
              grid,
              rowIndex,
              columnIndex,
              playerKey,
              nbAlign,
              nbMaxAlign
            );
          }

          score += calculatePoint(nbMaxAlign);
        }
        return score;
      }

      function calculateScoreDiagonals() {
        let score = 0;
        let rows = grid.length;
        let cols = grid[0].length;

        for (let slice = 0; slice < rows + cols - 1; ++slice) {
          let z1 = slice < cols ? 0 : slice - cols + 1;
          let z2 = slice < rows ? 0 : slice - rows + 1;

          let nbDiagonalAlign = 0;
          let nbMaxDiagonalAlign = 0;
          let nbAntiDiagonalAlign = 0;
          let nbMaxAntiDiagonalAlign = 0;

          for (let j = slice - z2; j >= z1; --j) {
            // Diagonale
            [nbDiagonalAlign, nbMaxDiagonalAlign] = calculateAlignment(
              grid,
              j,
              slice - j,
              playerKey,
              nbDiagonalAlign,
              nbMaxDiagonalAlign
            );

            // Anti-diagonale
            [nbAntiDiagonalAlign, nbMaxAntiDiagonalAlign] = calculateAlignment(
              grid,
              rows - 1 - j,
              slice - j,
              playerKey,
              nbAntiDiagonalAlign,
              nbMaxAntiDiagonalAlign
            );
          }

          // Ajout du score pour les diagonales et anti-diagonales
          score += calculatePoint(nbMaxDiagonalAlign);
          score += calculatePoint(nbMaxAntiDiagonalAlign);
        }
        return score;
      }

      let winner = null;
      let score = calculateScoreRowOrColumn("row");
      score += calculateScoreRowOrColumn("column");
      score += calculateScoreDiagonals();

      return { score, winner };
    },
  },
};

module.exports = GameService;

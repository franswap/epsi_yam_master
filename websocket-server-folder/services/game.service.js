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
    { viewContent: "1", id: "brelan1", owner: "player:1", canBeChecked: false },
    { viewContent: "3", id: "brelan3", owner: "player:1", canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: "player:1", canBeChecked: false },
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
        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerTimer =
          gameState.currentTurn === playerKey ? gameState.timer : 0;
        const opponentTimer =
          gameState.currentTurn === playerKey ? 0 : gameState.timer;
        return { playerTimer: playerTimer, opponentTimer: opponentTimer };
      },
      gamePawns: (playerKey, gameState) => {
        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerPawns =
          gameState.currentTurn === playerKey
            ? gameState.player2Pawns
            : gameState.player1Pawns;
        const opponentPawns =
          gameState.currentTurn === playerKey
            ? gameState.player1Pawns
            : gameState.player2Pawns;
        return { playerPawns: playerPawns, opponentPawns: opponentPawns };
      },
      gameScore: (playerKey, gameState) => {
        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerScore = playerKey === "player:1" ? gameState.player1Score : gameState.player2Score;
        const opponentScore = playerKey === "player:1" ? gameState.player2Score : gameState.player1Score;
        return { playerScore, opponentScore };
      },
      deckViewState: (playerKey, gameState) => {
        const deckViewState = {
          displayPlayerDeck: gameState.currentTurn === playerKey,
          displayOpponentDeck: gameState.currentTurn !== playerKey,
          displayRollButton:
            gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
          rollsCounter: gameState.deck.rollsCounter,
          rollsMaximum: gameState.deck.rollsMaximum,
          dices: gameState.deck.dices,
        };
        return deckViewState;
      },
      choicesViewState: (playerKey, gameState) => {
        const choicesViewState = {
          displayChoices: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: gameState.choices.idSelectedChoice,
          availableChoices: gameState.choices.availableChoices,
        };
        return choicesViewState;
      },
      gridViewState: (playerKey, gameState) => {
        return {
          displayGrid: true,
          canSelectCells:
            playerKey === gameState.currentTurn &&
            gameState.choices.availableChoices.length > 0,
          grid: gameState.grid,
        };
      },
      gameSummary: (gameState) => {
        // Déterminer le vainqueur et le perdant
        let loser = gameState.winner === "player:1" ? "player:2" : "player:1";

        // Créer le résumé de la partie
        const gameSummary = {
          winner: gameState.winner,
          loser: !gameState.winner,
          scores: {
            player1Score: gameState.player1Score,
            player2Score: gameState.player2Score,
          },
          // Ajoutez ici toute autre information que vous voulez inclure
        };

        return gameSummary;
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
    resetcanBeCheckedCells: (grid) => {
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

    findDiceIndexByDiceId: (dices, idDice) => {
      for (let i = 0; i < dices.length; i++) {
        if (dices[i].id === idDice) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
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

      let score = 0;
      let nbRowAlign = 0;
      let nbMaxRowAlign = 0;
      let nbColumn = 0;
      let nbMaxColumnAlign = 0;

      for (let i = 0; i < grid.length; i++) {
        nbRowAlign = 0;
        nbMaxRowAlign = 0;
        nbColumn = 0;
        nbMaxColumnAlign = 0;

        for (let j = 0; j < grid[i].length; j++) {
          // Calculer le score par ligne
          [nbRowAlign, nbMaxRowAlign] = calculateAlignment(
            grid,
            i,
            j,
            playerKey,
            nbRowAlign,
            nbMaxRowAlign
          );

          // Calculer le score par colonne
          [nbColumn, nbMaxColumnAlign] = calculateAlignment(
            grid,
            j,
            i,
            playerKey,
            nbColumn,
            nbMaxColumnAlign
          );
        }

        // Calculer le score par ligne
        if (nbMaxRowAlign == 3) score += 1;
        else if (nbMaxRowAlign == 4) score += 2;

        // Calculer le score par colonne
        if (nbMaxColumnAlign == 3) score += 1;
        else if (nbMaxColumnAlign == 4) score += 2;

        // console.log("nbMaxRowAlign", nbMaxRowAlign);
        // console.log("nbMaxColumnAlign", nbMaxColumnAlign);
      }

      let nbDiagonalAlign = 0;
      let nbMaxDiagonalAlign = 0;
      let nbAntiDiagonalAlign = 0;
      let nbMaxAntiDiagonalAlign = 0;

      // Calculer le score par diagonale
      let rows = grid.length;
      let cols = grid[0].length;

      for (let slice = 0; slice < rows + cols - 1; ++slice) {
        let z1 = slice < cols ? 0 : slice - cols + 1;
        let z2 = slice < rows ? 0 : slice - rows + 1;

        nbDiagonalAlign = 0;
        nbMaxDiagonalAlign = 0;
        nbAntiDiagonalAlign = 0;
        nbMaxAntiDiagonalAlign = 0;

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

        // console.log("nbMaxDiagonalAlign", nbMaxDiagonalAlign);
        // console.log("nbMaxAntiDiagonalAlign", nbMaxAntiDiagonalAlign);

        // Calculer le score par diagonale
        if (nbMaxDiagonalAlign == 3) score += 1;
        else if (nbMaxDiagonalAlign == 4) score += 2;

        // Calculer le score par anti-diagonale
        if (nbMaxAntiDiagonalAlign == 3) score += 1;
        else if (nbMaxAntiDiagonalAlign == 4) score += 2;
      }

      return score;
    },
  },
};

export default GameService;

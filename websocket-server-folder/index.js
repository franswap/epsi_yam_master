import express from "express";
import http from "http";
import { Server } from "socket.io";
import uniqid from "uniqid";
import GameService from "./services/game.service.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------

let queue = [];
let games = [];

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const emitToPlayers = (game, event, argsPlayer1, argsPlayer2) => {
  game.player1Socket.emit(event, argsPlayer1);
  game.player2Socket.emit(event, argsPlayer2);
};

const emitClientsViewGameStart = (game) =>
  emitToPlayers(
    game,
    "game.start",
    GameService.send.forPlayer.gameViewState("player:1", game),
    GameService.send.forPlayer.gameViewState("player:2", game)
  );

const updateClientsViewTimers = (game) =>
  emitToPlayers(
    game,
    "game.timer",
    GameService.send.forPlayer.gameTimer("player:1", game.gameState),
    GameService.send.forPlayer.gameTimer("player:2", game.gameState)
  );

const updateClientsViewDecks = (game) =>
  setTimeout(() => {
    emitToPlayers(
      game,
      "game.deck.view-state",
      GameService.send.forPlayer.deckViewState("player:1", game.gameState),
      GameService.send.forPlayer.deckViewState("player:2", game.gameState)
    );
  }, 50);

const updateClientsViewChoices = (game) =>
  setTimeout(() => {
    emitToPlayers(
      game,
      "game.choices.view-state",
      GameService.send.forPlayer.choicesViewState("player:1", game.gameState),
      GameService.send.forPlayer.choicesViewState("player:2", game.gameState)
    );
  }, 50);

const updateClientsViewGrid = (game) =>
  setTimeout(() => {
    emitToPlayers(
      game,
      "game.grid.view-state",
      GameService.send.forPlayer.gridViewState("player:1", game.gameState),
      GameService.send.forPlayer.gridViewState("player:2", game.gameState)
    );
  }, 50);

const updateGameInterval = (game) => {
  game.gameState.timer--;

  // if timer is down to 0, we end turn
  if (game.gameState.timer === 0) {
    // switch currentTurn variable
    game.gameState.currentTurn =
      game.gameState.currentTurn === "player:1" ? "player:2" : "player:1";

    // Reset timer, deck, choices and grid
    game.gameState.timer = GameService.timer.getTurnDuration();
    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(
      game.gameState.grid
    );

    // Update clients view decks, choices and grid
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  }
  // Update clients view timers
  updateClientsViewTimers(game);
};

const handlePlayersDisconnects = (game, gameInterval) => {
  game.player1Socket.on("disconnect", () => {
    clearInterval(gameInterval);
  });
  game.player2Socket.on("disconnect", () => {
    clearInterval(gameInterval);
  });
};

const createGame = (player1Socket, player2Socket) => {
  // init objet (game) with this first level of structure:
  // - gameState : { .. evolutive object .. }
  // - idGame : just in case ;)
  // - player1Socket: socket instance key "joueur:1"
  // - player2Socket: socket instance key "joueur:2"
  const newGame = GameService.init.gameState();
  newGame["idGame"] = uniqid();
  newGame["player1Socket"] = player1Socket;
  newGame["player2Socket"] = player2Socket;
  games.push(newGame);

  // Send game start event to players
  emitClientsViewGameStart(newGame);

  // Update clients view
  updateClientsViewTimers(newGame);
  updateClientsViewDecks(newGame);
  updateClientsViewGrid(newGame);

  // Timer every second
  const gameInterval = setInterval(() => updateGameInterval(newGame), 1000);

  // When a player disconnects, we clear the timer
  handlePlayersDisconnects(newGame, gameInterval);
};

const newPlayerInQueue = (socket) => {
  queue.push(socket);

  // Queue management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  } else {
    socket.emit("queue.added", GameService.send.forPlayer.queueViewState());
  }
};

const leaveQueue = (socket) => {
  const index = queue.indexOf(socket);
  if (index > -1) queue.splice(index, 1);

  socket.emit("queue.removed", GameService.send.forPlayer.queueViewState());
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on("connection", (socket) => {
  console.log(`[${socket.id}] socket connected`);

  socket.on("queue.join", () => {
    console.log(`[${socket.id}] new player in queue `);
    newPlayerInQueue(socket);
  });

  socket.on("queue.leave", () => {
    console.log(`[${socket.id}] player leave the queue`);
    leaveQueue(socket);
  });

  socket.on("game.dices.roll", () => {
    // Get game
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    const game = games[gameIndex];

    // Roll dices
    const dices = GameService.dices.roll(game.gameState.deck.dices);
    game.gameState.deck.dices = dices;
    game.gameState.deck.rollsCounter++;

    // Constants for rolls management
    const rollsCounter = game.gameState.deck.rollsCounter;
    const rollsMaximum = game.gameState.deck.rollsMaximum;
    const isDefi = false;
    const isSec = rollsCounter === 2;
    const combinations = GameService.choices.findCombinations(
      dices,
      isDefi,
      isSec
    );

    // Update available choices
    game.gameState.choices.availableChoices = combinations;

    // if last roll we lock every dice
    if (rollsCounter - 1 === rollsMaximum) {
      game.gameState.deck.dices = GameService.dices.lockEveryDice(dices);
      game.gameState.timer = 5;
    }

    // Update clients view
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
  });

  socket.on("game.dices.lock", (idDice) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    const diceIndex = GameService.utils.findDiceIndexByDiceId(
      games[gameIndex].gameState.deck.dices,
      idDice
    );

    games[gameIndex].gameState.deck.dices[diceIndex].locked =
      !games[gameIndex].gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(games[gameIndex]);
  });

  socket.on("game.choices.selected", (data) => {
    // Get game
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    const game = games[gameIndex];

    // Gestion des choix
    game.gameState.choices.idSelectedChoice = data.choiceId;

    // Gestions de la grille
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(
      game.gameState.grid
    );
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(
      data.choiceId,
      game.gameState.grid
    );

    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on("game.grid.selected", (data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    const game = games[gameIndex];

    // La sélection d'une cellule signifie la fin du tour (ou plus tard le check des conditions de victoires)
    // On reset l'état des cases qui étaient précédemment clicables.
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(
      game.gameState.grid
    );
    game.gameState.grid = GameService.grid.selectCell(
      data.cellId,
      data.rowIndex,
      data.cellIndex,
      game.gameState.currentTurn,
      game.gameState.grid
    );

    // TODO: Ici calculer le score
    // TODO: Puis check si la partie s'arrête (lines / diagolales / no-more-gametokens)
    //Décompte des points
    // Un alignement horizontal, vertical ou en diagonale de trois pions rapporte 1 point.
    // Un alignement de quatre pions rapporte 2 points.
    // La partie s’achève lorsqu’un des joueurs n’a plus de pions (le joueur avec le plus de points est alors le vainqueur, les joueurs commencent la partie avec 12 pions à leur disposition) ou lorsqu’un des joueurs réalise un alignement de cinq pions (il gagne instantanément la partie).

    // Calculate score
    if (game.gameState.currentTurn === "player:1") {
      game.gameState.player1Score = GameService.utils.calculateScore(
        game.gameState.grid,
        game.gameState.player1Score
      );
    } else if (game.gameState.currentTurn === "player:2") {
      game.gameState.player2Score = GameService.utils.calculateScore(
        game.gameState.grid,
        game.gameState.player2Score
      );
    }

    // Check if the game ends
    // const hasNoMoreTokens = GameService.game.checkNoMoreTokens(game.gameState); // Plus de pions
    // const hasFiveInARow = GameService.game.checkFiveInARow(game.gameState.grid); // 5 en ligne

    // if (hasNoMoreTokens) {
    //   game.gameState.winner =
    //     game.gameState.player1Score > game.gameState.player2Score
    //       ? "player:1"
    //       : "player:2";
    // } else if (hasFiveInARow) {
    //   game.gameState.winner = game.gameState.currentTurn;
    // }

    // // Si la partie est terminée, on envoie l'événement game.winner aux joueurs
    // if (game.gameState.winner) {
    //   emitToPlayers(
    //     game,
    //     "game.winner",
    //     GameService.send.forPlayer.gameViewState("player:1", game),
    //     GameService.send.forPlayer.gameViewState("player:2", game)
    //   );
    // }

    // Sinon on finit le tour
    game.gameState.currentTurn =
      game.gameState.currentTurn === "player:1" ? "player:2" : "player:1";

    // On remet le timer, le deck et les choix par défaut (la grille ne change pas)
    game.gameState.timer = GameService.timer.getTurnDuration();
    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();

    // et on remet à jour la vue
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
    updateClientsViewTimers(game);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get("/", (req, res) => res.sendFile("index.html"));

server.listen(3000, function () {
  console.log("listening on *:3000");
});

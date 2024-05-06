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
// -------- EMIT METHODS -----------
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

const updateClientsViewPawns = (game) =>
  emitToPlayers(
    game,
    "game.pawns",
    GameService.send.forPlayer.gamePawns("player:1", game.gameState),
    GameService.send.forPlayer.gamePawns("player:2", game.gameState)
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

function updateClientsViewScore(game) {
  emitToPlayers(
    game,
    "score.update",
    GameService.send.forPlayer.gameScore("player:1", game.gameState),
    GameService.send.forPlayer.gameScore("player:2", game.gameState)
  );
}

function updateClientsViewEnd(game) {
  emitToPlayers(
    game,
    "game.end",
    GameService.send.forPlayer.gameSummary(game.gameState),
    GameService.send.forPlayer.gameSummary(game.gameState)
  );
}

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

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
  }
  // Update clients view timers
  updateClientsViewTimers(game);
  updateClientsViewGrid(game);
  updateClientsViewPawns(game);
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
  updateClientsViewScore(newGame);

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

    updateClientsViewPawns(game);
    updateClientsViewScore(game);
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
    // On reset l'état des cases qui étaient précédemment cliquables.
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

    // Calcul du score d'un joueur et du gagnant
    const { score, winner } = GameService.utils.calculateScore(
      game.gameState.currentTurn,
      game.gameState.grid
    );

    // Décrementation des pionts lorsqu'un joueur en place un + Mise à jour du score
    if (game.gameState.currentTurn === "player:1") {
      game.gameState.player1Pawns--;
      game.gameState.player1Score = score;
    } else if (game.gameState.currentTurn === "player:2") {
      game.gameState.player2Pawns--;
      game.gameState.player2Score = score;
    }

    // Puis check si la partie s'arrête (plus de pions ou gagnant trouvé avec calculateScore)
    const hasNoMorePawns =
      game.gameState.player1Pawns === 0 || game.gameState.player2Pawns === 0; // Plus de pions

    // Mise à jour du gagnant
    if (hasNoMorePawns || winner) {
      if (winner) {
        game.gameState.winner = winner;
      } else if (game.gameState.player1Score > game.gameState.player2Score) {
        game.gameState.winner = "player:1";
      } else if (game.gameState.player1Score < game.gameState.player2Score) {
        game.gameState.winner = "player:2";
      } else {
        game.gameState.winner = null;
      }
    }
    console.log(game.gameState);

    // Si la partie est terminée, on met à jour la vue de fin
    if (game.gameState.winner || hasNoMorePawns) {
      updateClientsViewEnd(game);
    }

    // Sinon on finit le tour
    else
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

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var uniqid = require("uniqid");
const GameService = require("./services/game.service.js");

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------

let queue = [];
let games = [];

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const emitClientsViewGameStart = (game) => {
  game.player1Socket.emit(
    "game.start",
    GameService.send.forPlayer.gameViewState("player:1", game)
  );
  game.player2Socket.emit(
    "game.start",
    GameService.send.forPlayer.gameViewState("player:2", game)
  );
};

const updateClientsViewTimers = (game) => {
  game.player1Socket.emit(
    "game.timer",
    GameService.send.forPlayer.gameTimer("player:1", game.gameState)
  );
  game.player2Socket.emit(
    "game.timer",
    GameService.send.forPlayer.gameTimer("player:2", game.gameState)
  );
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.deck.view-state",
      GameService.send.forPlayer.deckViewState("player:1", game.gameState)
    );
    game.player2Socket.emit(
      "game.deck.view-state",
      GameService.send.forPlayer.deckViewState("player:2", game.gameState)
    );
  }, 200);
};

const updateClientsViewChoices = (game) => {
  game.player1Socket.emit(
    "game.choices.view-state",
    GameService.send.forPlayer.choicesViewState("player:1", game.gameState)
  );
  game.player2Socket.emit(
    "game.choices.view-state",
    GameService.send.forPlayer.choicesViewState("player:2", game.gameState)
  );
};

const updateGameInterval = (game) => {
  game.gameState.timer--;

  // if timer is down to 0, we end turn
  if (game.gameState.timer === 0) {
    // switch currentTurn variable
    game.gameState.currentTurn =
      game.gameState.currentTurn === "player:1" ? "player:2" : "player:1";

    // Reset timer, deck and choices
    game.gameState.timer = GameService.timer.getTurnDuration();
    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();

    // Update clients view decks and choices
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
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

  // Timer every second
  const gameInterval = setInterval(() => updateGameInterval(newGame), 1000);

  // Update clients view
  updateClientsViewTimers(newGame);
  updateClientsViewDecks(newGame);

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
    socket.emit("queue.added", GameService.send.forPlayer.viewQueueState());
  }
};

const leaveQueue = (socket) => {
  const index = queue.indexOf(socket);
  if (index > -1) queue.splice(index, 1);

  socket.emit("queue.removed", GameService.send.forPlayer.viewQueueState());
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

  // socket.on("game.dices.roll", () => {
  //   const gameIndex = GameService.utils.findGameIndexBySocketId(
  //     games,
  //     socket.id
  //   );
  //   // dices management
  //   games[gameIndex].gameState.deck.dices = GameService.dices.roll(
  //     games[gameIndex].gameState.deck.dices
  //   );
  //   games[gameIndex].gameState.deck.rollsCounter++;

  //   // combinations management
  //   const dices = games[gameIndex].gameState.deck.dices;
  //   const isDefi = false;
  //   const isSec = games[gameIndex].gameState.deck.rollsCounter === 2;

  //   // if last throw
  //   if (
  //     games[gameIndex].gameState.deck.rollsCounter ===
  //     games[gameIndex].gameState.deck.rollsMaximum
  //   ) {
  //     games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(
  //       games[gameIndex].gameState.deck.dices
  //     );
  //     // temporary put timer at 5 sec to test turn switching
  //     games[gameIndex].gameState.timer = 5;
  //   }

  //   const combinations = GameService.choices.findCombinations(
  //     dices,
  //     isDefi,
  //     isSec
  //   );
  //   games[gameIndex].gameState.choices.availableChoices = combinations;

  //   // emit to views new state
  //   updateClientsViewDecks(games[gameIndex]);
  //   updateClientsViewChoices(games[gameIndex]);
  // });

  socket.on("game.dices.roll", () => {
    // Get game
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    const game = games[gameIndex];

    // Roll dices
    const dices = game.gameState.deck.dices;
    game.gameState.deck.dices = GameService.dices.roll(dices);
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
    // gestion des choix
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    games[gameIndex].gameState.choices.idSelectedChoice = data.choiceId;

    updateClientsViewChoices(games[gameIndex]);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get("/", (req, res) => res.sendFile("index.html"));

http.listen(3000, function () {
  console.log("listening on *:3000");
});

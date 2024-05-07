import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PlayerDeck from "./decks/player-deck.component";
import OpponentDeck from "./decks/opponent-deck.component";
import PlayerTimer from "./timers/player-timer.component";
import OpponentTimer from "./timers/opponent-timer.component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";
import PlayerPawns from "./pawns/pawns.component";
import PlayerScore from "./scores/playerScore.component";
import OpponentScore from "./scores/opponentScore.component";

const OpponentInfos = () => {
  return (
    <View style={styles.opponentInfosContainer}>
      <Text>Opponent infos</Text>
    </View>
  );
};

const PlayerInfos = () => {
  return (
    <View style={styles.playerInfosContainer}>
      <Text>Player Infos</Text>
    </View>
  );
};

const Board = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { height: "5%" }]}>
        <OpponentInfos />
        <View style={styles.opponentTimerScoreContainer}>
          <OpponentTimer />
          <OpponentScore />
        </View>
      </View>

      <View style={[styles.row, { height: "25%" }]}>
        <OpponentDeck />
      </View>

      <View style={[styles.row, { height: "40%" }]}>
        <Grid />
        <Choices />
      </View>

      <View style={[styles.row, { height: "25%" }]}>
        <PlayerDeck />
      </View>

      <View style={[styles.row, { height: "5%" }]}>
        <PlayerInfos />
        <View style={styles.playerTimerScoreContainer}>
          <PlayerTimer />
          <PlayerScore />
          <PlayerPawns />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#272744",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    color: "white",
    backgroundColor: "#8b6d9c",
    borderRadius: 25,
  },
  opponentInfosContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "black",
    color: "white",
    backgroundColor: "#494d7e",
  },
  opponentTimerScoreContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#494d7e",
  },
  opponentTimerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#494d7e",
  },
  opponentScoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#494d7e",
  },
  deckOpponentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    backgroundColor: "white",
  },
  gridContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "black",
  },
  choicesContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    color: "#f2d3ab",
    backgroundColor: "#494d7e",
  },
  deckPlayerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    color: "white",
    backgroundColor: "#494d7e",
  },
  playerInfosContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    color: "white",
    backgroundColor: "#494d7e",
  },
  playerTimerScoreContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#494d7e",
  },
  playerTimerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#494d7e",
  },
  playerScoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#494d7e",
  },
});

export default Board;

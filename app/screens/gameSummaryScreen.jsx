import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SocketContext } from "../contexts/socket.context";

const GameSummaryScreen = () => {
  //   const socket = useContext(SocketContext);
  //   const [gameSummary, setGameSummary] = useState(0);

  //   useEffect(() => {
  //     socket.on("game.end", (data) => {
  //       setGameSummary(data["gameSummary"]);
  //     });
  //   }, []);

  const handlePress = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé de la partie</Text>
      <Text style={styles.text}>Vainqueur: {/* {gameSummary.winner} */}</Text>
      <Text style={styles.text}>Perdant: {/* {gameSummary.loser} */}</Text>
      <Text style={styles.text}>
        Score du joueur 1: {/*{gameSummary.scores.player1Score} */}
      </Text>
      <Text style={styles.text}>
        Score du joueur 2: {/* {gameSummary.scores.player2Score} */}
      </Text>
      <Button title="Retour à l'accueil" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default GameSummaryScreen;

import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SocketContext } from "../contexts/socket.context";

const GameSummaryScreen = ({ route, navigation }) => {
  const socket = useContext(SocketContext);
  const [gameSummary, setGameSummary] = useState(null);

  useEffect(() => {
    setGameSummary(route.params.data);
    console.log(gameSummary);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé de la partie</Text>
      {gameSummary ? (
        <>
          <Text style={styles.text}>Vainqueur: {gameSummary.winner}</Text>
          <Text style={styles.text}>Perdant: {gameSummary.loser}</Text>
          <Text style={styles.text}>
            Score du joueur 1:{gameSummary.scores.player1Score}
          </Text>
          <Text style={styles.text}>
            Score du joueur 2: {gameSummary.scores.player2Score}
          </Text>
          <Button
            title="Revenir au menu"
            onPress={() => navigation.navigate("HomeScreen")}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
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

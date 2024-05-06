import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const GameSummaryScreen = ({ route, navigation }) => {
  const [gameSummary, setGameSummary] = useState(null);

  useEffect(() => {
    setGameSummary(route.params.data);
    console.log(gameSummary);
  }, []);

  // Pour info gameSummary = { isWinner, isLoser, isDraw, playerScore, opponentScore }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé de la partie</Text>
      {gameSummary ? (
        <>
          {gameSummary.isWinner && (
            <Text style={styles.text}>Vous avez gagné !</Text>
          )}
          {gameSummary.isLoser && (
            <Text style={styles.text}>Vous avez perdu...</Text>
          )}
          {gameSummary.isDraw && <Text style={styles.text}>Match nul !</Text>}
          <Text style={styles.text}>
            Votre score : {gameSummary.playerScore}
          </Text>
          <Text style={styles.text}>
            Score de l'adversaire : {gameSummary.opponentScore}
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

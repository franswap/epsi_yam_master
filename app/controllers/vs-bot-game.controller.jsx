import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../contexts/socket.context";
import Board from "../components/board/board.component";
import Header from "../components/header";
import Button from "../components/button";

export default function VsBotGameController({ navigation }) {
  const socket = useContext(SocketContext);
  const [inGame, setInGame] = useState(false);

  // Écouter l'événement 'game.end'
  useEffect(() => {
    socket.on("game.end", (data) => {
      navigation.navigate("GameSummaryScreen", { data });
    });

    // Supprimer l'écouteur d'événement lorsque le composant est démonté
    return () => {
      socket.off("game.end");
    };
  }, [navigation, socket]);

  useEffect(() => {
    socket.emit("vsbot.join");

    socket.on("game.start", (data) => {
      console.log("[listen][game.start]:", data);
      setInGame(data["inGame"]);
    });
  }, []);

  return (
    <View style={styles.container}>
      {!inGame && (
        <>
          <Header />
          <Text style={[styles.paragraph, styles.spacing]}>
            En attente du serveur...
          </Text>
          <Button
            onPress={() => navigation.navigate("HomeScreen")}
            text="Revenir au menu"
            iconName="home"
          />
        </>
      )}

      {inGame && <Board />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#272744",
  },
  paragraph: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B6D9C",
  },
  spacing: {
    paddingTop: 30,
    paddingBottom: 30,
  },
});

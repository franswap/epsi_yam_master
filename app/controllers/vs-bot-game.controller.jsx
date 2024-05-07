import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../contexts/socket.context";
import Board from "../components/board/board.component";

export default function OnlineGameController({ navigation }) {
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
          <Text style={styles.paragraph}>Waiting for server datas...</Text>
        </>
      )}

      {inGame && <Board />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  paragraph: {
    fontSize: 16,
  },
});

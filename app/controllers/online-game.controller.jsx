import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SocketContext } from "../contexts/socket.context";
import Board from "../components/board/board.component";

export default function OnlineGameController({ navigation }) {
  const socket = useContext(SocketContext);

  const [inQueue, setInQueue] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [idOpponent, setIdOpponent] = useState(null);

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

  // fonction pour quitter la queue
  const leaveQueue = () => {
    console.log("[emit][queue.leave]:", socket.id);
    socket.emit("queue.leave");
    navigation.navigate("HomeScreen");
  };

  useEffect(() => {
    console.log("[emit][queue.join]:", socket.id);
    socket.emit("queue.join");
    setInQueue(false);
    setInGame(false);

    socket.on("queue.added", (data) => {
      console.log("[listen][queue.added]:", data);
      setInQueue(data["inQueue"]);
      setInGame(data["inGame"]);
    });

    socket.on("game.start", (data) => {
      console.log("[listen][game.start]:", data);
      setInQueue(data["inQueue"]);
      setInGame(data["inGame"]);
      setIdOpponent(data["idOpponent"]);
    });

    socket.on("queue.removed", (data) => {
      console.log("[listen][queue.leave]:", data);
      setInQueue(data["inQueue"]);
      setInGame(data["inGame"]);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>YAM MASTER</Text>
      </View>
      {!inQueue && !inGame && (
        <>
          <Text style={styles.paragraph}>Waiting for server datas...</Text>
        </>
      )}

      {inQueue && (
        <>
          <Text style={styles.paragraph}>Waiting for another player...</Text>
          <TouchableOpacity style={styles.button} onPress={leaveQueue}>
            <Text style={styles.buttonText}>Revenir au menu</Text>
          </TouchableOpacity>
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
  button: {
    backgroundColor: "#F2D3AB",
    borderRadius: 25,
    color: "#494D7E",
    height: 60,
    width: 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "0%",
    color: "#494D7E",
  },
});

import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const PlayerScore = () => {
    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);

    useEffect(() => {
        socket.on("score.update", (data) => {
            setPlayerScore(data["player1Score"]);
        });
    }, []);

    return (
        <View style={styles.playerScoreContainer}>
            <Text>Score: {playerScore}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerScoreContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgrey",
    },
});

export default PlayerScore;

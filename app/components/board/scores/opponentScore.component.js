import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const OpponentScore = () => {
    const socket = useContext(SocketContext);
    const [opponentScore, setOpponentScore] = useState(0);

    useEffect(() => {
        socket.on("score.update", (data) => {
            setOpponentScore(data["player2Score"]);
        });
    }, []);

    return (
        <View style={styles.playerScoreContainer}>
            <Text>Opponent Score: {opponentScore}</Text>
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

export default OpponentScore;

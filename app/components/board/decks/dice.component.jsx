import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const Dice = ({ index, locked, value, onPress, opponent }) => {
  const handlePress = () => onPress(index, opponent);

  return (
    <TouchableOpacity
      style={[styles.dice, locked && styles.lockedDice]}
      onPress={handlePress}
      disabled={opponent}
    >
      <Text style={styles.diceText}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dice: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lockedDice: {
    backgroundColor: "#c69fa5",
  },
  diceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#494d7e",
  },
  opponentText: {
    fontSize: 12,
    color: "red",
  },
});

export default Dice;

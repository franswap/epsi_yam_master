import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Choice = ({ choice, idSelectedChoice, canMakeChoice, onPress }) => {
  const handlePress = () => onPress(choice.id);

  return (
    <TouchableOpacity
      key={choice.id}
      style={[
        styles.choiceButton,
        idSelectedChoice === choice.id && styles.selectedChoice,
        !canMakeChoice && styles.disabledChoice,
      ]}
      onPress={handlePress}
      disabled={!canMakeChoice}
    >
      <Text style={styles.choiceText}>{choice.value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  choiceButton: {
    backgroundColor: "#f2d3ab",
    borderRadius: 5,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 40,
  },
  selectedChoice: {
    backgroundColor: "#c69fa5",
  },
  disabledChoice: {
    opacity: 0.5,
  },
  choiceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#494d7e",
  },
});

export default Choice;

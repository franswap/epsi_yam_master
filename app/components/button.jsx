import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importation des icônes
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

const Button = ({ onPress, text, iconName, iconNameMaterial, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.innerContainer}>
        {iconName && (
          <FontAwesome5 name={iconName} size={25} color={colors.white} />
        )}
        {iconNameMaterial && (
          <MaterialCommunityIcons
            name={iconNameMaterial}
            size={25}
            color={colors.white}
          />
        )}
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.indigo,
    borderRadius: 25,
    height: 60,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginLeft: 10,
  },
});

export default Button;

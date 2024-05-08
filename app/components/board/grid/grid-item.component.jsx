import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

const GridItem = ({ cell, isSelectable, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        cell.owner === "player:1" && styles.playerOwnedCell,
        cell.owner === "player:2" && styles.opponentOwnedCell,
        isSelectable && styles.selectableCell,
      ]}
      onPress={onPress}
      disabled={!isSelectable}
    >
      <Text
        style={[
          styles.cellText,
          cell.owner === "player:1" && styles.playerOwnedCellText,
          cell.owner === "player:2" && styles.opponentOwnedCellText,
          isSelectable && styles.selectableCellText,
        ]}
      >
        {cell.viewContent}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Cell styles
  cell: {
    flexDirection: "row",
    flex: 2,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.mauve,
    borderRadius: 10,
    margin: 1,
  },
  playerOwnedCell: {
    backgroundColor: colors.beige,
  },
  opponentOwnedCell: {
    backgroundColor: colors.lightPink,
  },
  selectableCell: {
    backgroundColor: colors.white,
  },

  // Cell text styles
  cellText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
  },
  playerOwnedCellText: {
    color: colors.darkBlue,
  },
  opponentOwnedCellText: {
    color: colors.darkBlue,
  },
  selectableCellText: {
    color: colors.darkBlue,
  },
});

export default GridItem;

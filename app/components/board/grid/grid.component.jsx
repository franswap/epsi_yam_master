import { useEffect, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import GridItem from "./grid-item.component";

const Grid = () => {
  const socket = useContext(SocketContext);

  const [displayGrid, setDisplayGrid] = useState(false);
  const [canSelectCells, setCanSelectCells] = useState([]);
  const [grid, setGrid] = useState([]);
  const scale = useSharedValue(1);

  // Style animé basé sur la valeur partagée
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    // Déclenchement de l'animation avec un effet smooth
    scale.value = withSequence(
      withTiming(1.2, { duration: 200 }), // Augmente la taille
      withTiming(1, { duration: 200 }) // Réduit la taille
    );

    // Remplissage progressif
    opacity.value = withTiming(1, { duration: 400 });
  };
  const handleSelectCell = (cellId, rowIndex, cellIndex) => {
    if (canSelectCells) {
      socket.emit("game.grid.selected", { cellId, rowIndex, cellIndex });
    }
  };

  useEffect(() => {
    socket.on("game.grid.view-state", (data) => {
      setDisplayGrid(data["displayGrid"]);
      setCanSelectCells(data["canSelectCells"]);
      setGrid(data["grid"]);
    });
  }, [socket]);

  return (
    <View style={styles.gridContainer}>
      {displayGrid &&
        grid.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, animatedStyle]}>
            {row.map((cell, cellIndex) => {
              const isSelectable = cell.canBeChecked && !cell.owner;

              return (
                <GridItem
                  key={cell.id}
                  cell={cell}
                  isSelectable={isSelectable}
                  onPress={() => {
                    handleSelectCell(cell.id, rowIndex, cellIndex);
                    handlePress();
                  }}
                />
              );
            })}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },
});

export default Grid;

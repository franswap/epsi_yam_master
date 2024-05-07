import { useEffect, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import { colors } from "../../../constants/colors";

const Grid = () => {
  const socket = useContext(SocketContext);

  const [displayGrid, setDisplayGrid] = useState(false);
  const [canSelectCells, setCanSelectCells] = useState([]);
  const [grid, setGrid] = useState([]);

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
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => {
              const isSelectable = cell.canBeChecked && !cell.owner;

              return (
                <TouchableOpacity
                  key={cell.id}
                  style={[
                    styles.cell,
                    cell.owner === "player:1" && styles.playerOwnedCell,
                    cell.owner === "player:2" && styles.opponentOwnedCell,
                    isSelectable && styles.selectableCell,
                    rowIndex !== 0 && styles.topBorder,
                    cellIndex !== 0 && styles.leftBorder,
                  ]}
                  onPress={() => handleSelectCell(cell.id, rowIndex, cellIndex)}
                  disabled={!isSelectable}
                >
                  <Text
                    style={[
                      styles.cellText,
                      isSelectable && styles.selectableCellText,
                    ]}
                  >
                    {cell.viewContent}
                  </Text>
                </TouchableOpacity>
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
  cell: {
    flexDirection: "row",
    flex: 2,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#8b6d9c",
    backgroundColor: "#8b6d9c",
    borderRadius: 10,
    margin: 1,
  },
  cellText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  playerOwnedCell: {
    backgroundColor: colors.beige,
    opacity: 0.9,
  },
  opponentOwnedCell: {
    backgroundColor: colors.lightPink,
    opacity: 0.9,
  },
  selectableCell: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.blue,
  },
  selectableCellText: {
    color: "#8b6d9c",
  },
  topBorder: {
    borderTopWidth: 1,
  },
  leftBorder: {
    borderLeftWidth: 1,
  },
});

export default Grid;

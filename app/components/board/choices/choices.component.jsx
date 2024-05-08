import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import { colors } from "../../../constants/colors";

const Choices = () => {
  const socket = useContext(SocketContext);

  const [displayChoices, setDisplayChoices] = useState(false);
  const [canMakeChoice, setCanMakeChoice] = useState(false);
  const [idSelectedChoice, setIdSelectedChoice] = useState(null);
  const [availableChoices, setAvailableChoices] = useState([]);

  useEffect(() => {
    socket.on("game.choices.view-state", (data) => {
      setDisplayChoices(data["displayChoices"]);
      setCanMakeChoice(data["canMakeChoice"]);
      setIdSelectedChoice(data["idSelectedChoice"]);
      setAvailableChoices(data["availableChoices"]);
    });
  }, []);

  const handleSelectChoice = (choiceId) => {
    if (canMakeChoice) {
      setIdSelectedChoice(choiceId);
      socket.emit("game.choices.selected", choiceId);
    }
  };

  return (
    <View style={styles.choicesContainer}>
      <Text style={styles.choiceTitle}>Choix:</Text>
      {availableChoices.length === 0 ? (
        <View style={styles.noChoicesContainer}>
          <Text style={styles.noChoicesText}>Pas de choix disponibles</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.choicesScrollView}
        >
          {displayChoices &&
            availableChoices.map((choice) => (
              <TouchableOpacity
                key={choice.id}
                style={[
                  styles.choiceButton,
                  idSelectedChoice === choice.id && styles.selectedChoice,
                  !canMakeChoice && styles.disabledChoice,
                ]}
                onPress={() => handleSelectChoice(choice.id)}
                disabled={!canMakeChoice}
              >
                <Text style={styles.choiceText}>{choice.value}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  choicesContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    borderRadius: 25,
    borderColor: "#494d7e",
    backgroundColor: "#494d7e",
  },
  choicesText: {
    marginLeft: 10,
  },
  noChoicesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  choicesScrollView: {
    flex: 1,
  },
  choiceButton: {
    backgroundColor: "#f2d3ab",
    borderRadius: 5,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90px",
    height: "35px",
  },
  selectedChoice: {
    backgroundColor: "#c69fa5",
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginLeft: 15,
  },
  choiceText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#494d7e",
  },
  noChoicesText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.white,
  },
  disabledChoice: {
    opacity: 0.5,
  },
});

export default Choices;

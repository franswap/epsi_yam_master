import { StyleSheet, View, Button, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>YAM MASTER</Text>
      </View>
      <View style={styles.bloc}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("OnlineGameScreen")}
        >
          <Text style={styles.buttonText}>Jouer en ligne</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bloc}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("VsBotGameScreen")}
        >
          <Text style={styles.buttonText}>Jouer contre le bot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#272744",
  },
  title: {
    fontSize: 36,
    color: "#8B6D9C",
    fontWeight: "bold",
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
  bloc: {
    margin: 40,
  },
});

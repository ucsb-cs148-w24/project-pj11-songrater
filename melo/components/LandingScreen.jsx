import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";

export default function LandingScreen({ navigation }) {
  const navigateToSearch = () => {
    navigation.navigate("Search");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBFA", padding: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Melo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          title="Enter Melo"
          onPress={navigateToSearch}
          style={buttons.outline}
        >
          <Text style={styles.enterButton}>Rank a Song</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    // marginTop: 16,
    // paddingVertical: 8,
    color: '#3187D8',
    textAlign: 'center',
    fontSize: 45,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  enterButton: {
    color: '#3187D8',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});

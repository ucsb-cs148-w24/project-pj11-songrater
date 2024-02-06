import { useFonts } from "expo-font";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";

export default function LandingScreen({ navigation }) {
  const navigateToSearchSong = () => {
    navigation.navigate("SearchSong");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFAEA", padding: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>Melo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          title="Search for a Song"
          onPress={navigateToSearchSong}
          style={buttons.outline}
        >
          <Text style={typography.default_l}>Search Song</Text>
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
});

import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { styles } from "./helper/Styles";
import { buttons } from "./helper/Buttons";

export default function LandingScreen({ navigation }) {
  const navigateToSearch = () => {
    navigation.navigate("Search");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBFA", padding: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>Melo</Text>
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


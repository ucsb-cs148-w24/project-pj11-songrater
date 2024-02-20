import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { styles } from "./helper/Styles";
import { buttons } from "./helper/Buttons";

export default function ProfileScreen({ navigation }) {
  const navigateToSearch = () => {
    navigation.navigate("Search");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBFA", padding: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>My Profile</Text>
      </View>
    </View>
  );
}

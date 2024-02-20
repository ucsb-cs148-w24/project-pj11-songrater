import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { styles } from "./helper/Styles";
import { buttons } from "./helper/Buttons";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>My Profile</Text>
      </View>
    </View>
  );
}

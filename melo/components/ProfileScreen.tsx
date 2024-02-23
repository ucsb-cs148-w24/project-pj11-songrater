import { Pressable, StyleSheet, Text, View } from "react-native";
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>Your Profile</Text>
      </View>
      <Pressable></Pressable>
    </View>
  );
}

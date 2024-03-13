import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export const LoadingScreen = ({navigation}) => {

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate("Splash")
      }
      else {
        navigation.navigate("Landing")
      }
    });

    return sub;
    }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFAEA", padding: 20, pointerEvents: "none" }}>
      <Text>Loading...</Text>
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

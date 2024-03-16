import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { SERVER_URL } from "../App";

export default function SplashScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const Logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Log Out Failed");
      });
  };

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Landing");
      }
    });

    return sub;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFBFA", padding: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>Melo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          title="Login"
          onPress={navigateToLogin}
          style={buttons.outline}
        >
          <Text style={typography.default_l}>Login</Text>
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

import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";
import { LoginButton } from "./LoginButton";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect } from "react";
import { useState } from "react";

export default function LandingScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigateToSearch = () => {
    navigation.navigate("Search");
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  }

  const Logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsLoggedIn(false);
    }).catch((error) => {
      console.error("Log Out Failed")
    });
  }

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (!user) {
          navigation.navigate("Login");
          setIsLoggedIn(false);
        }
        else {
          console.log(user.uid);
          setIsLoggedIn(true);
        }
      }, 10);
    });

    return sub;
    }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFAEA", padding: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={typography.title}>Melo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          title="Enter Melo"
          onPress={navigateToSearch}
          style={buttons.outline}
        >
          <Text style={typography.default_l}>Search Song</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        { !isLoggedIn && <Pressable
          title="Login"
          onPress={navigateToLogin}
          style={buttons.outline}
        >
          <Text style={typography.default_l}>Login</Text>
        </Pressable> }
        { isLoggedIn && <Pressable
          title="Logout"
          onPress={Logout}
          style={buttons.outline}
        >
          <Text style={typography.default_l}>Logout</Text>
        </Pressable> }
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

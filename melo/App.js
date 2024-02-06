import LandingPage from "./components/LandingScreen";
import { useFonts } from "expo-font";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import MainContainer from "./navigation/MainContainer";
import { NavigationContainer } from "@react-navigation/native";
import MyStack from "./Navigation";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "AnonymousPro-Bold": require("./assets/fonts/AnonymousPro-Bold.ttf"),
    "AnonymousPro-Regular": require("./assets/fonts/AnonymousPro-Regular.ttf"),
  });

  return (
    <View style={styles.container}>
      <MainContainer />
      <MyStack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FFFAEA",
  },
});

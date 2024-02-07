import LandingPage from "./components/LandingPage";
import { useFonts } from "expo-font";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import MainContainer from "./navigation/MainContainer";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "AnonymousPro-Bold": require("./assets/fonts/AnonymousPro-Bold.ttf"),
    "AnonymousPro-Regular": require("./assets/fonts/AnonymousPro-Regular.ttf"),
  });

  return (
    <View style={styles.container}>
      <MainContainer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "FFF9EC",
  },
});

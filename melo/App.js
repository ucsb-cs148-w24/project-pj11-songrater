import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import MainContainer from "./navigation/MainContainer";

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
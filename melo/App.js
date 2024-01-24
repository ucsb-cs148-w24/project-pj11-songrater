import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [word, setWord] = useState("");

  useEffect(() => {
    const response = fetch("http://127.0.0.1:5000").then((data) => {
      console.log(data);
      return data.json;
    });
    setWord(response.body);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Word: {word}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

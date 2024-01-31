import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import MainContainer from "./navigation/MainContainer";

export default function App() {
  const [title, setTitle] = useState("");
  const [titleData, setTitleData] = useState("");

  const fetchTitle = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/title?title=${title}`)
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setTitleData(JSON.stringify(data));
        });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    // <View style={styles.container}>
    //   <TextInput
    //     value={title}
    //     onChangeText={setTitle}
    //     placeholder="Enter a title"
    //   />
    //   <Button title="Submit" onPress={fetchTitle} />
    //   <Text>Response:</Text>
    //   <Text>{titleData}</Text>
    //   {/* Add StatusBar if needed */}
    // </View>
    <MainContainer/>
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

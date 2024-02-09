import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import MainContainer from "./navigation/MainContainer";
import Login from "./components/Login.js";
import Home from "./components/Home";
import React from 'react';
import {useAuth0, Auth0Provider} from 'react-native-auth0';

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
    
    <View style={styles.container}>
      {/* <Text>Word: {word}</Text>
      <StatusBar style="auto" /> */}
      <Text>Hi</Text>
      <Auth0Provider domain={"dev-5dxtr87z3xjn6mhj.us.auth0.com"} clientId={"jYKXbZxyumLHH1QDlWYzQyZwTAfsSGCe"} redirectUri={"melo://dev-5dxtr87z3xjn6mhj.us.auth0.com/ios/com.auth0samples/callback"}>
        <Home />
      </Auth0Provider>
      {/* <Login /> */}
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

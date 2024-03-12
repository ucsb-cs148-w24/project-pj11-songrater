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

export const Default = () => {

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFAEA", padding: 20 }}>
      <Text>Hello</Text>
    
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

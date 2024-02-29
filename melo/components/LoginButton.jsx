import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


export const LoginButton = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginButton}>
      {/* For Text */}
      <Text style={styles.loginButtonText}>Login</Text>
      {/* For Icon */}
      {/* <Ionicons name="log-in-outline" size={25} color="black" /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    marginRight: 10,
  },
  loginButtonText: {
    color: 'blue',
    // Add more styling as needed
  },
});

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
    backgroundColor: 'transparent', // Clear background
    border: '2px solid black', // Black border
    color: 'black', // Text color
    padding: '10px 20px', // Inner space of the button
    fontSize: '16px', // Text size
    cursor: 'pointer', // Cursor appearance on hover
    borderRadius: '5px', // Rounded corners
  },
  loginButtonText: {
    color: 'blue',
    // Add more styling as needed
  },
});

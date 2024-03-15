import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { objectToUrlParams } from "./helper/functions";

export const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createProfile = async (uid, email) => {
    try {
      const userProfileParams = {
        uid: uid, // TODO : change once we get valid user IDs
        email: email,
      };

      const response = await fetch(
        "http://127.0.0.1:5000/api/signup?" +
          objectToUrlParams(userProfileParams),
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const responseData = await response.json(); // This parses the JSON content from the response

      console.log("Received response data");
      console.log(responseData); // Now you have the parsed data
      return responseData;
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const registerAndGoToMainFlow = async () => {
    if (email && password) {
      try {
        const auth = await getAuth();
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (response.user) {
          navigation.navigate("Landing");
          console.log(response.user.email);
          await createProfile(response.user.uid, response.user.email);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const navigateLogin = async () => {
    try {
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.contentView} onStartShouldSetResponder={() => true}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Register</Text>
        </View>
        <View style={styles.mainContent}>
          <TextInput
            style={styles.inputField}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={registerAndGoToMainFlow}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateLogin}>
          <Text style={styles.normalText}>Have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBFA", // Sets background color to white
  },
  container: {
    width: "80%", // Sets the width to 80% of the parent container
  },
  titleText: {
    fontSize: 24, // Sets a standard font size for the title
    fontWeight: "bold", // Makes the title text bold
    marginBottom: 20, // Adds a margin below the title for spacing
    textAlign: "center", // Centers the title text
  },
  normalText: {
    fontSize: 16, 
    textAlign: "center", 
  },
  inputField: {
    borderWidth: 1, // Adds a border with 1px width
    borderColor: "#ddd", // Sets the border color
    padding: 10, // Adds padding inside the text fields for spacing
    marginBottom: 10, // Adds a margin below each text field for spacing
    borderRadius: 5, // Rounds the corners of the text fields
  },
  button: {
    backgroundColor: "#3187D8", // Sets the button background color
    padding: 15, // Adds padding inside the button for spacing
    borderRadius: 5, // Rounds the corners of the button
    alignItems: "center", // Centers the button text
    margin: 5,
  },
  buttonText: {
    color: "#fff", // Sets the button text color to white
    fontSize: 16, // Sets the font size for the button text
  },
});

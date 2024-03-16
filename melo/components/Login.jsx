import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { SERVER_URL } from "../App";

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const createProfile = async (uid, email) => {
    try {
      const formData = new FormData();
      formData.append("uid", uid);
      formData.append("email", email);
      // Assuming username and description are required by your Flask API.
      // You'll need to add these fields or modify as necessary.
      formData.append("description", ""); // Update this with actual description

      const response = await fetch(`${SERVER_URL}/api/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.json();

      return jsonResponse;
    } catch (error) {
      console.error("Error creating profile:", error);
      return { MESSAGE: `Error creating profile: ${error}` }; // Return or handle error response as needed
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        createProfile(result.user.uid, result.user.email);

        console.log("User logged in:", result.user);

        if (result.user) {
          navigation.navigate("LandingScreen");
        }

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        console.error("ERROR:", error);
      });
  };

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", response.user);

      if (response.user) {
        setLoginError(false);
        navigation.navigate("LandingScreen");
      }
    } catch (error) {
      setLoginError(true);
    }
  };

  const navigateRegister = async () => {
    try {
      navigation.navigate("Register");
    } catch (error) {
      console.error("Register: ", error);
    }
  };

  return (
    <View style={styles.contentView}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Login</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Sign in With Google</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={navigateRegister}>
          <Text style={styles.normalText}>
            Don't have an account? Click here to register
          </Text>
        </TouchableOpacity>
        {loginError == true ? (
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.errorText}>Invalid email or password</Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBFA",
  },
  container: {
    width: "80%",
  },
  errorText: {
    color: "red",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  normalText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3187D8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

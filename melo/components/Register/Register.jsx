import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createProfile = async (response) => {
    // Create Profile Query Here
  };

  const registerAndGoToMainFlow = async () => {
    if (email && password) {
      try {
        const auth = await getAuth();
        const response = await createUserWithEmailAndPassword(auth, email, password);
        if (response.user) {
          await createProfile(response);
        }
      } catch (error) {
        console.log(error);
      }
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
            style={styles.loginTextField}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.loginTextField}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.loginTextField}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={registerAndGoToMainFlow}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  contentView: {
    flex: 1, // This makes it take the entire height of the screen
    backgroundColor: 'white',
  },
  container: {
    marginHorizontal: 50,
    paddingTop: 20,
  },
  titleContainer: {
    justifyContent: 'center',
    flexGrow: 1.2,
  },
  titleText: {
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '200',
  },
  loginTextField: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 60,
    fontSize: 30,
    marginVertical: 10,
    fontWeight: '300',
  },
  mainContent: {
    flexGrow: 6,
  },
  ctaButton: {
    // Assuming you want some basic button styles here, you'd adjust as needed
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue', // Placeholder color
    borderRadius: 5,
  },
  primary: {
    // If you have specific styles for primary buttons, add them here
    backgroundColor: 'blue', // Example primary button color
  },
  secondary: {
    // Secondary button styles
    backgroundColor: 'gray', // Example secondary button color
  },
});

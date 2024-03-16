import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import MainContainer from "./navigation/MainContainer";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Corrected import
import { getDatabase } from "firebase/database"; // Add this if you're using Firebase Realtime Database
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALVYo9xSLBgrJ3w6NXnYCe6PDFj2_LOow",
  authDomain: "melo-c42ea.firebaseapp.com",
  databaseURL: "https://melo-c42ea-default-rtdb.firebaseio.com",
  projectId: "melo-c42ea",
  storageBucket: "melo-c42ea.appspot.com",
  messagingSenderId: "948219294613",
  appId: "1:948219294613:web:d6190054fbfd44983cfc9c",
  measurementId: "G-7QFZJD1QMV",
};

// When using local, change server_url to local_url
export const AWS_URL = "http://18.224.93.12:5000";
export const LOCAL_URL = "http://127.0.0.1:5000";
export const SERVER_URL = AWS_URL;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

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
    backgroundColor: "#FFFBFA",
  },
});

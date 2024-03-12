import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { LoginButton } from "../components/LoginButton";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useState } from "react";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


// Screens
import ProfileScreen from "../components/ProfileScreen";
import SearchSongScreen from "../components/SearchSongScreen";
import RateSongScreen from "../components/RateSongScreen";
import LandingScreen from "../components/LandingScreen";
import { registerVersion } from "firebase/app";
import FriendsScreen from "../components/FriendsScreen";
import { Default } from "../components/Default";

// Screen names
const homeName = "Home";
const profileName = "Profile";
const searchName = "Search";
const friendName = "Friend"
const splashName = "Splash";
const splashStackName = "SplashStack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Stack2 = createNativeStackNavigator();

function SongStack() {
  return (
    <Stack.Navigator initialRouteName={"SearchSong"}>
      <Stack.Screen
        name="SearchSong"
        component={SearchSongScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RateSong"
        component={RateSongScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function SplashStack() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (!user) {
          setIsLoggedIn(false);
          setInitialRouteName(splashName);
        } else {
          setIsLoggedIn(true);
          setInitialRouteName("Landing");
        }
      }, 5);
    });
  }, []);

  return (
    <Stack2.Navigator initialRouteName={splashName}>
      <Stack2.Screen
        name={splashName}
        component={Default}
        options={{ headerShown: false }}
      />
      <Stack2.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack2.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack2.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </Stack2.Navigator>
  );
}

function MainContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (!user) {
          setIsLoggedIn(false);
        }
        else {
          setIsLoggedIn(true);
        }
      }, );
    });
    }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            let color = focused ? "#3187D8" : "#BBCDE5";

            if (route.name === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === searchName) {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === profileName) {
              iconName = focused ? "person-circle" : "person-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {
            paddingBottom: 5,
            fontSize: 10,
          },
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
          tabBarBackgroundColor: "red",
        })}
      >
        <Tab.Screen name={"Home"} component={SplashStack} />
        <Tab.Screen name={searchName} component={SongStack} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
        <Tab.Screen name={friendName} component={FriendsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { LoginButton } from "../components/LoginButton";

// Screens
import ProfileScreen from "../components/ProfileScreen";
import SearchSongScreen from "../components/SearchSongScreen";
import RateSongScreen from "../components/RateSongScreen";
import LandingScreen from "../components/LandingScreen";
import { registerVersion } from "firebase/app";
import FriendsScreen from "../components/FriendsScreen";

// Screen names
const homeName = "Home";
const profileName = "Profile";
const searchName = "Search";
const friendName = "Friend"

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

function HomeStack() {
  return (
    
    <Stack2.Navigator initialRouteName={"LandingScreen"}>
      <Stack2.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }}  />
      <Stack2.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack2.Screen name="Register" component={Register} options={{ headerShown: false }} />
  
    </Stack2.Navigator>
  );
}

function MainContainer() {
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
        <Tab.Screen name={homeName} component={HomeStack} />
        <Tab.Screen name={searchName} component={SongStack} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
        <Tab.Screen name={friendName} component={FriendsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;

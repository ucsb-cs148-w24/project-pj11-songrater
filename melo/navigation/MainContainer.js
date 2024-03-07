import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import ProfileScreen from "../components/ProfileScreen";
import SearchSongScreen from "../components/SearchSongScreen";
import RateSongScreen from "../components/RateSongScreen";
import LandingScreen from "../components/LandingScreen";
import FriendsScreen from "../components/FriendsScreen";

// Screen names
const homeName = "Home";
const profileName = "Profile";
const searchName = "Search";
const friendName = "Friend"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
        })}
      >
        <Tab.Screen name={homeName} component={LandingScreen} options={{ headerShown: false }} />
        <Tab.Screen name={searchName} component={SongStack} options={{ headerShown: false }} />
        <Tab.Screen name={profileName} component={ProfileScreen} options={{ headerShown: false }} />
        <Tab.Screen name={friendName} component={FriendsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;

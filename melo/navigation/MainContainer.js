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

//Screen names
const homeName = "Home";
const profileName = "Profile";
const searchName = "Search";

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
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === searchName) {
              iconName = focused ? "search" : "search-outline";
            } else if (rn === profileName) {
              iconName = focused ? "person-circle" : "person-circle-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {
            "paddingBottom": 10,
            "fontSize": 10
          },
          tabBarStyle: [
            {
              "display": "flex"
            },
            null
          ],
          tabBarBackgroundColor: "red",
        })}
      >
        <Tab.Screen name={homeName} component={LandingScreen} />
        <Tab.Screen name={searchName} component={SongStack} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;

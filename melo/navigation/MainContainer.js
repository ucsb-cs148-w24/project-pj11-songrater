import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { LoginButton } from "../components/LoginButton";
import { useState } from "react";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Screens
import ProfileScreen from "../components/ProfileScreen";
import SearchSongScreen from "../components/SearchSongScreen";
import RateSongScreen from "../components/RateSongScreen";
import LandingScreen from "../components/LandingScreen";
import EditUserScreen from "../components/EditUserScreen";
import { registerVersion } from "firebase/app";
import FriendsScreen from "../components/FriendsScreen";
import FriendProfile from "../components/FriendProfile";
import { LoadingScreen } from "../components/LoadingScreen";
import SplashScreen from "../components/SplashScreen";

// Screen names
const homeName = "Home";
const profileName = "Profile";
const searchName = "Search";
const friendName = "Friend";
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
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="RateSong"
        component={RateSongScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function ProfileStack(){
  return(
    <Stack.Navigator initialRouteName={"ProfileScreen"}>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditUserScreen"
        component={EditUserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{headerShown:false}}
      />
    </Stack.Navigator> 
     );
}

function FriendStack(){
  return(
    <Stack.Navigator initialRouteName={"FriendsScreen"}>
      <Stack.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{headerShown:false}}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator> 
     );
}

function SplashStack() {
  const [initialRouteName, setInitialRouteName] = useState("Loading");

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setInitialRouteName("Loading");
      } else {
        console.log(user);
        setInitialRouteName("Landing");
      }
    });

    return sub;
  }, []);

  return (
    <Stack2.Navigator initialRouteName={{ initialRouteName }}>
      <Stack2.Screen
        name={"Loading"}
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack2.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack2.Screen
        name={splashName}
        component={SplashScreen}
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
        } else {
          setIsLoggedIn(true);
        }
      });
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
            } else if (route.name === friendName) {
              iconName = focused ? "person-add" : "person-add-outline";
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
              display:
                getFocusedRouteNameFromRoute(route) === "Splash" ||
                getFocusedRouteNameFromRoute(route) === "Login" ||
                getFocusedRouteNameFromRoute(route) === "Register" ||
                getFocusedRouteNameFromRoute(route) === "Loading"
                  ? "none"
                  : "flex",
            },
            null,
          ],
          tabBarBackgroundColor: "red",
        })}
      >
        <Tab.Screen
          name={"Home"}
          component={SplashStack}
          options={({ route }) => ({
            headerShown:
              getFocusedRouteNameFromRoute(route) !== "Splash" &&
              getFocusedRouteNameFromRoute(route) !== "Login" &&
              getFocusedRouteNameFromRoute(route) !== "Register" &&
              getFocusedRouteNameFromRoute(route) !== "Loading",
          })}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
              navigation.navigate("Landing");
            },
          })}
        />
        <Tab.Screen
          name={searchName}
          component={SongStack}
          options={{ unmountOnBlur: true }}
        />
        <Tab.Screen
          name={profileName}
          component={ProfileStack}
          options={{ unmountOnBlur: true }}
        />
        <Tab.Screen 
        name={friendName} 
        component={FriendStack} 
        options={{ unmountOnBlur: true }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
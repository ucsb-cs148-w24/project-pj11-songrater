import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  Searchbar,
  Avatar,
  Card,
  IconButton,
  Text,
  Paragraph,
  Divider,
} from "react-native-paper";
import ScreenWrapper from "./helper/ScreenWrapper";
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { useExampleTheme } from "./helper/Themes";
import { buttons } from "./helper/Buttons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SplashScreen from "./SplashScreen";
import { SERVER_URL } from "../App";

function LandingScreen({ navigation }) {
  const [uname, setUname] = useState("");
  const [feedData, setFeedData] = useState([]);
  const [user_id, setUserId] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      console.log(user.uid);
      if (user) {
        const response = fetch(`${SERVER_URL}/api/get_profile?uid=${user.uid}`)
          .then((response) => response.json())
          .then((data) => {
            setUserId(data?.results[0]?.id);
            setUname(data?.results[0]?.username);
            return data?.results[0]?.id;
          })
          .then((id) => {
            if (id != 0) {
              fetchFeed(id);
            }
          });
      }
    });
    return sub;
  }, [navigation, useIsFocused()]);

  const fetchUserInfo = async () => {
    const curr_info = await fetch(
      `${SERVER_URL}/api/get_profile?user_id=${user_id}`
    ).then((curr_info) => curr_info.json());
    try {
      setUname(curr_info.results[0].username);
    } catch {
      console.log("Error getting User Info");
    }
  };

  const fetchFeed = async (user_id) => {
    try {
      const feedSongs = await fetch(
        `${SERVER_URL}/api/friends_top_songs?user_id=${user_id}`
      ).then((feedSongs) => feedSongs.json());

      var newArr = [];
      newArr = newArr.concat(feedSongs.top_songs);

      newArr = newArr.filter(function (element) {
        return element !== undefined;
      });
      console.log(newArr);
      setFeedData(newArr);
    } catch {
      console.log("Error fetching feed");
    }
  };

  const { colors, isV3 } = useExampleTheme();
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedHearts, setSelectedHearts] = useState({});
  const [selectedPluses, setSelectedPluses] = useState({});

  const [searchQueries, setSearchQuery] = React.useState({
    searchBarMode: "",
    traileringIcon: "",
    traileringIconWithRightItem: "",
    rightItem: "",
    loadingBarMode: "",
    searchViewMode: "",
    searchWithoutBottomLine: "",
    loadingViewMode: "",
    clickableBack: "",
    clickableDrawer: "",
    clickableLoading: "",
  });

  const TextComponent = isV3 ? Text : Paragraph;

  const handleCardPress = (item) => {
    setSelectedCard(selectedCard === item.id ? null : item.id);
  };

  const handleHeartPress = (item) => {
    setSelectedHearts((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
  };

  const handlePlusPress = (item) => {
    setSelectedPluses((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
  };

  const renderRatingColor = (rating) => {
    if (rating >= 7.5) {
      return "green"; // High ratings
    } else if (rating >= 5 && rating <= 7.4) {
      return "orange"; // Mediocre ratings
    } else {
      return "red"; // Low ratings
    }
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleCardPress(item)}>
      <Card style={styles.card} mode={"elevated"}>
        {selectedCard === item.id && (
          <>
            <Card.Cover source={item.cover} />
            <View style={styles.iconContainer}>
              <View style={styles.circleBackground}>
                <IconButton
                  icon={selectedPluses[item.id] ? "plus-thick" : "plus"}
                  iconColor={selectedPluses[item.id] ? "#3187D8" : "#BBCDE5"}
                  size={40}
                  onPress={() => handlePlusPress(item)}
                />
              </View>
            </View>
          </>
        )}

        <Card.Title
          title={
            <>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text> gave a{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: renderRatingColor(item.rating),
                }}
              >
                {item.rating}
              </Text>
            </>
          }
          titleVariant={
            selectedCard === item.id ? "headlineSmall" : "bodyLarge"
          }
          left={(props) => (
            <Avatar.Image
              style={styles.avatar}
              source={item.avatar}
              size={40}
            />
          )}
          right={(props: any) => (
            <IconButton
              {...props}
              icon={selectedHearts[item.id] ? "heart" : "heart-outline"}
              iconColor={selectedHearts[item.id] ? "#3187D8" : "#BBCDE5"}
              onPress={() => handleHeartPress(item)}
            />
          )}
        />

        <Card.Content>
          <TextComponent
            variant={selectedCard === item.id ? "bodyMedium" : "bodySmall"}
            style={{
              paddingLeft: 55,
              paddingBottom: selectedCard === item.id ? 20 : 14,
            }}
          >
            to <Text style={{ fontWeight: "bold" }}>{item.title}</Text> by{" "}
            <Text style={{ fontWeight: "bold" }}>{item.artist}</Text>
          </TextComponent>
        </Card.Content>
      </Card>
    </Pressable>
  );

  const renderItem2 = ({ item }) => (
    <Pressable onPress={() => handleCardPress(item)}>
      <Card style={styles.card} mode={"elevated"}>
        {selectedCard === item.song_id && (
          <>
            <Card.Cover
              source={require("../assets/fearless-album-cover.jpeg")}
            />
            <View style={styles.iconContainer}>
              <View style={styles.circleBackground}>
                <IconButton
                  icon={selectedPluses[item.song_id] ? "plus-thick" : "plus"}
                  iconColor={
                    selectedPluses[item.song_id] ? "#3187D8" : "#BBCDE5"
                  }
                  size={40}
                  onPress={() => handlePlusPress(item)}
                />
              </View>
            </View>
          </>
        )}

        <Card.Title
          title={
            <>
              <Text style={{ fontWeight: "bold" }}>{item.friend_name}</Text>{" "}
              ranked this song at #{" "}
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {item.rank}
              </Text>
            </>
          }
          titleVariant={
            selectedCard === item.song_id ? "headlineSmall" : "bodyLarge"
          }
          left={(props) => (
            <Avatar.Image
              style={styles.avatar}
              source={require("../assets/default-avatar.jpeg")}
              size={40}
            />
          )}
          right={(props: any) => (
            <IconButton
              {...props}
              icon={selectedHearts[item.song_id] ? "heart" : "heart-outline"}
              iconColor={selectedHearts[item.song_id] ? "#3187D8" : "#BBCDE5"}
              onPress={() => handleHeartPress(item)}
            />
          )}
        />

        <Card.Content>
          <TextComponent
            variant={selectedCard === item.song_id ? "bodyMedium" : "bodySmall"}
            style={{
              paddingLeft: 55,
              paddingBottom: selectedCard === item.id ? 20 : 14,
            }}
          >
            to <Text style={{ fontWeight: "bold" }}>{item.song_name}</Text> by{" "}
            <Text style={{ fontWeight: "bold" }}>{item.artist_name}</Text>
          </TextComponent>
        </Card.Content>
      </Card>
    </Pressable>
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoggedIn(false);
        navigation.navigate("Splash");
      } else {
        setIsLoggedIn(true);
      }
    });

    return sub;
  }, [navigation]);

  const navigateToSearch = () => {
    navigation.navigate("Search");
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const Logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        navigation.navigate("Splash");
      })
      .catch((error) => {
        console.error("Log Out Failed");
      });
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <ScrollView>
        <View
          style={[
            styles.preference,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={typography.title}>Melo</Text>
          </View>
          <View style={[buttons.primary, { width: 144, height: 48 }]}>
            <Pressable
              style={[buttons.outline, { width: 144, height: 48 }]}
              onPress={Logout}
            >
              <Text>Logout</Text>
            </Pressable>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.preference}>
          <View style={styles.titleContainer}>
            <Text style={typography.header}>Your Feed</Text>
          </View>
        </View>
        {feedData.length == 0 ? (
          <View style={styles.titleContainer}>
            <Text style={typography.header2}>
              Please add more friends to see your feed
            </Text>
          </View>
        ) : (
          <FlatList
            data={feedData}
            keyExtractor={(item) => item.song_id.toString()}
            renderItem={renderItem2}
            style={[styles.container]}
            contentContainerStyle={styles.content}
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

LandingScreen.title = "Landing Screen";

export default LandingScreen;

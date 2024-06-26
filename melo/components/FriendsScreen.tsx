import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Searchbar,
  Avatar,
  Card,
  Chip,
  Button,
  IconButton,
  Paragraph,
  Divider,
} from "react-native-paper";
import ProfileScreen from "./ProfileScreen";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { objectToUrlParams } from "./helper/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SERVER_URL } from "../App";

export default function FriendsScreen({ navigation }) {
  const [UserId, setUserId] = useState(0);
  const [friendsdata, setFriendsData] = useState([]);
  const [searchFriendsData, setSearchFriendsData] = useState([]);
  const [newname, setName] = useState("");
  const [fid, setFid] = useState([]);
  const [fexist, setFexist] = useState("");
  const [pfid, setPfid] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const response = fetch(`${SERVER_URL}/api/get_profile?uid=${user.uid}`)
          .then((response) => response.json())
          .then((data) => {
            setUserId(data?.results[0]?.id);
            fetchFriendsList(data?.results[0]?.id);
          });
      }
    });
    return sub;
  }, [navigation, useIsFocused()]);

  useEffect(() => {
    console.log(fid);
    console.log(UserId); // This will log the updated value of fid after the component re-renders
  }, [fid]);

  useEffect(() => {
    if (UserId != 0) {
      fetchFriendsList(UserId);
    }
  }, [UserId]);

  useEffect(() => {
    IfExist(fid);
  }, [fid]);

  const renderCard = ({ item }) => (
    <Card style={styles.card} mode={"elevated"}>
      <Card.Content>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Avatar.Text
            size={64}
            label={item.username[0]}
            style={{ backgroundColor: "#3187D8" }}
          />
          <Text style={{ flex: 1, marginLeft: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.username}
            </Text>
          </Text>
          <Pressable
            onPress={() => {
              DeleteFriend(item.id);
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, marginRight: 26 }}>
              {"x"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigateFriendProfile({
                Fid: item.id,
                Fname: item.username,
                Fdesc: item.description,
              });
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, marginRight: 16 }}>
              {">"}
            </Text>
          </Pressable>
        </View>
      </Card.Content>
    </Card>
  );

  const renderNewcard = ({ item }) => (
    <Card style={styles.card} mode={"elevated"}>
      <Card.Content>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Avatar.Text
            size={64}
            label={item.username[0]}
            style={{ backgroundColor: "#3187D8" }}
          />
          <Text style={{ flex: 1, marginLeft: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.username}
            </Text>
          </Text>
          <Pressable
            onPress={() => {
              if (fexist == "You can add him/her as a friend.") {
                AddFriend(item.id);
              }
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, marginRight: 16 }}>
              {"+"}
            </Text>
          </Pressable>
        </View>
      </Card.Content>
    </Card>
  );

  const [isLoading, setIsLoading] = useState(false);
  const [searchFriendsState, setSearchFriendsState] = useState(false);

  const navigateFriendProfile = ({ Fid, Fname, Fdesc }) => {
    navigation.navigate("FriendProfile", {
      user_id: Fid,
      username: Fname,
      description: Fdesc,
    });
  };

  const fetchFriend = async () => {
    try {
      setIsLoading(true);
      if (!(newname == "")) {
        await fetch(
          `${SERVER_URL}//api/friends_specific?user_id=${UserId}&uname=${newname.toLowerCase()}`
        )
          .then((data) => {
            setIsLoading(false);
            return data.json();
          })
          .then((data) => {
            setSearchFriendsState(true);
            setSearchFriendsData(data.results);
            setFid(data.results[0].id);
          });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  const findUserId = async () => {
    const auth = getAuth();
    const id = auth.currentUser.uid;

    return id;
  };

  const findUserIntId = async (uid) => {
    const response = fetch(`${SERVER_URL}/api/get_profile\?uid=${uid}`);

    const responseJson = (await response).json();

    return responseJson["results"]["id"];
  };

  const IfExist = async (Fid) => {
    try {
      await fetch(
        `${SERVER_URL}/api/friend_exists?user_id=${UserId}&fid=${Fid}`
      )
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setFexist(data.MESSAGE);
        });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const AddFriend = async (Fid) => {
    try {
      const addFriendParams = {
        user_id: UserId, // TODO : change once we get valid user IDs
        fid: Fid,
      };

      // add friend
      const response = await fetch(
        `${SERVER_URL}/api/add_friend?` + objectToUrlParams(addFriendParams),
        {
          method: "POST",
        }
      )
        .then((response) => console.log(response))
        .then((response) => {
          fetchFriendsList(UserId);
          setFid([]);
        });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const DeleteFriend = async (Fid) => {
    try {
      const deleteFriendParams = {
        user_id: UserId,
        fid: Fid,
      };
      const response = await fetch(
        `${SERVER_URL}/api/delete_friend?` +
        objectToUrlParams(deleteFriendParams),
        {
          method: "DELETE",
        }
      )
        .then((response) => console.log(response))
        .then((response) => {
          fetchFriendsList(UserId);
        })
        .then((response) => {
          setFid(Fid);
        });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchFriendsList = async (userid) => {
    try {
      const Friends = await fetch(
        `${SERVER_URL}/api/get_friends?user_id=${userid}`
      ).then((Friends) => Friends.json());

      setFriendsData(Friends.results);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <View style={{ display: "flex", flex: 1, backgroundColor: "#F3F6F7" }}>
      <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.title}>Melo</Text>
        </View>
      </View>

      <View style={styles.preference}>
        <Searchbar
          onChangeText={setName}
          loading={isLoading}
          placeholder="Find a new Friend..."
          onSubmitEditing={fetchFriend}
          style={styles.searchbar}
          value={newname}
        />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            labelStyle={typography.default_w}
            onPress={fetchFriend}
          >
            Search
          </Button>
        </View>
      </View>

      {searchFriendsState && (
        <View style={{ flex: 8 }}>
          <View style={styles.preference}>
            <View style={styles.titleContainer}>
              <Text style={typography.header}>New Friend</Text>
            </View>
            <Pressable onPress={() => setSearchFriendsState(false)}>
              <View style={{ margin: 10, paddingTop: 20 }}>
                <Text style={typography.header2}>X</Text>
              </View>
            </Pressable>
          </View>
          <View style={{ flex: 10 }}>
            {searchFriendsData?.length > 0 ? (
              <FlatList
                data={searchFriendsData}
                keyExtractor={(item) => item.id}
                renderItem={renderNewcard}
                style={[styles.container]}
              />
            ) : (
              <View style={[styles.titleContainer, { padding: 10 }]}>
                <Text style={typography.default_l}>Friend not found</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.header}>Your Friends</Text>
        </View>
      </View>
      <View style={{ flex: 10 }}>
        <FlatList
          data={friendsdata}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          style={[styles.container]}
        />
      </View>
    </View>
  );
}

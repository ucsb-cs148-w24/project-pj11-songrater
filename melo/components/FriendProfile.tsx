import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { Avatar, Divider, Card, Button } from "react-native-paper";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProfileScreen({ route }) {
  const [uname, setUname] = useState("");
  const [description, setDescription] = useState("");
  const [songData, setSongData] = useState([]);
//   const [user_id, setUserId] = useState(0);
  const { user_id, username } = route.params;
  console.log("friend's userid:", user_id);


  useEffect(() => {
    if(user_id!=0){
    console.log("successfully fecthed songlists:");
    setUname(username);
    fetchUserSongList(user_id);
    }
  },[user_id])


  const fetchUserSongList = async (user_id) => {
    try {
      const responseGood = await fetch(
        `http://127.0.0.1:5000/api/get_user_songs?user_id=${user_id}&type=good`
      ).then((responseGood) => responseGood.json());

      const responseOk = await fetch(
        `http://127.0.0.1:5000/api/get_user_songs?user_id=${user_id}&type=ok`
      ).then((responseOk) => responseOk.json());

      const responseBad = await fetch(
        `http://127.0.0.1:5000/api/get_user_songs?user_id=${user_id}&type=bad`
      ).then((responseBad) => responseBad.json());
      var newArr = [];
      newArr = newArr.concat(responseGood.results);
      newArr = newArr.concat(responseOk.results);
      newArr = newArr.concat(responseBad.results);

      newArr = newArr.filter(function (element) {
        return element !== undefined;
      });
      console.log(newArr);
      setSongData(newArr);
    } catch {
      console.log("Error fetching user lists");
    }
  };

  const renderCard = ({ item }) => (
    <Card style={styles.card} mode={"elevated"}>
      <Card.Content>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.song_name}</Text>
            <Text> by </Text>
            <Text style={{ fontWeight: "bold" }}>{item.artist_name}</Text>
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              marginLeft: "auto",
              marginRight: 17,
            }}
          >
            {Math.round(item.rating * 10) / 10}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ display: "flex", flex: 1, backgroundColor: "#F3F6F7" }}>
      <View
        style={{
          flex: 1,
          marginTop: 40,
          marginLeft: 17,
          marginRight: 17,
          marginBottom: 5,
          flexDirection: "row",
        }}
      >
        <Avatar.Text
          size={64}
          label={uname[0]}
          style={{ backgroundColor: "#3187D8" }}
        />
        <Text
          style={{
            flex: 5,
            textAlign: "left",
            padding: 15,
            color: "#00120B",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {uname}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: 75,
          marginRight: 17,
          marginTop: 5,
          marginBottom: 5,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            flex: 1,
            textAlign: "left",
            padding: 10,
            color: "#A09E9E",
            fontSize: 15,
            flexWrap: "wrap-reverse",
          }}
        >
          {description}
        </Text>
      </View>
      {/* <Pressable
        style={{
          marginLeft: 17,
          marginRight: 17,
          marginTop: 5,
          marginBottom: 5,
          flex: 1,
          borderRadius: 10,
          justifyContent: "flex-start",
        }}
        onPress={() => {}}
      >
        <Divider
          style={{
            height: 1.5,
            marginTop: 17,
            marginHorizontal: 17,
            backgroundColor: "#3187D8",
          }}
        />
        <View style={{ display: "flex", flex: 1, flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: "center",
              marginLeft: 17,
              fontWeight: "bold",
            }}
          >
            Friends
          </Text>
          <Text
            style={{
              fontSize: 20,
              alignSelf: "center",
              marginLeft: "auto",
              marginRight: 17,
            }}
          >
            {">"}
          </Text>
        </View>
        <Divider
          style={{
            height: 1.5,
            marginHorizontal: 17,
            backgroundColor: "#3187D8",
          }}
        />
      </Pressable> */}
      <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.header}> {uname}'s Songs</Text>
        </View>
      </View>
      <View style={{ flex: 10 }}>
        <FlatList
          data={songData}
          keyExtractor={(item) => item.rating}
          renderItem={renderCard}
          style={[styles.container]}
          contentContainerStyle={styles.content}
        />
      </View>
    </View>
  );
}

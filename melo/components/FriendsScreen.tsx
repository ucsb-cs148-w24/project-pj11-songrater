import React, { useState, useEffect } from 'react';
import { Pressable, 
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
} from 'react-native-paper';
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";


const mocknewfriendname = "New Friend";
const mockfriend1 = "Friend1";
const mockfriend2 = "Friend2";
const mockfriend3 = "Friend3";
const mockfriend4 = "Friend4";
const mockDescription = "This is a test description!"
const mockFriendCount = 10;
const snow = '#FFFBFA'

export default function FriendsScreen({ navigation }){

  const [friendsdata, setFriendData] = useState([
    {id:'1', mockname: 'Friend1', avatar: require('../assets/default-avatar.jpeg')},
    {id:'2', mockname: 'Friend2', avatar: require('../assets/default-avatar.jpeg')},
    {id:'3', mockname: 'Friend3', avatar: require('../assets/default-avatar.jpeg')},
  ]);

  const [newname, setName] = useState("");

  const renderCard= ({ item }) => (
    <Card style={styles.card} mode={'elevated'}>
        <Card.Content>
          <View style={{flex:1, flexDirection:'row'}}>
            {/* Avatar on the left */}
            <Avatar.Image size={40} source={item.avatar} />
            <Text style={{flex:1,marginLeft: 10 }}>
              <Text style={{fontWeight:'bold'}}>{item.mockname}</Text>
            </Text>
          </View>
        </Card.Content>
      </Card>
  );

  const [isLoading, setIsLoading] = useState(false);

  const fetchFriend = async () => {
    try {
      setIsLoading(true);
      if (!(newname == "")) {
        await fetch(
          // need a function to fetch uid2 in friend table
          `http://127.0.0.1:5000/title?title=${newname}}`
        )
          .then((data) => {
            setIsLoading(false);
            return data.json();
          })
          .then((data) => {
            setFriendData(data.results);
          });
      }
    }catch (error) {
      setIsLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <View style={{display:'flex',flex:1,backgroundColor: "#BBCDE5"}}>

       <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.title}>Melo</Text>
        </View>
      </View>

      <View style={styles.preference}>
        <Searchbar
          onChangeText={setName}
          loading={isLoading}
          placeholder="Enter a Friend..."
          onSubmitEditing={fetchFriend}
          style={styles.searchbar}
          value={newname}
        />
        <View style={styles.buttonContainer}><Button style={styles.button} labelStyle={typography.default_w} onPress={fetchFriend}>
          Search
        </Button></View>
      </View>
     
      <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.header}>Your Friends</Text>
        </View>
      </View>  
      <View style={{flex:10}}>
        <FlatList
          data={friendsdata}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          style={[styles.container]}
          contentContainerStyle={styles.content}
          />
      </View>  
    </View>
    );
}

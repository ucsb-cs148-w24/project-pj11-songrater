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
    {id:'4', mockname: 'Friend4', avatar: require('../assets/default-avatar.jpeg')},
    {id:'5', mockname: 'Friend5', avatar: require('../assets/default-avatar.jpeg')},
    {id:'6', mockname: 'Friend6', avatar: require('../assets/default-avatar.jpeg')},
    {id:'7', mockname: 'Friend7', avatar: require('../assets/default-avatar.jpeg')},
    {id:'8', mockname: 'Friend8', avatar: require('../assets/default-avatar.jpeg')},
    {id:'9', mockname: 'Friend9', avatar: require('../assets/default-avatar.jpeg')},
  ]);

  const [searchFriendsData, setSearchFriendsData] = useState([{id:'1', mockname: 'Bob', avatar: require('../assets/default-avatar.jpeg')},]);

  const [newname, setName] = useState("");

  const renderCard= ({ item }) => (
    <Card style={styles.card} mode={'elevated'}>
        <Card.Content>
          {/* onPress -- friends profile popup */}
          <Pressable>
            <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
              <Avatar.Image size={40} source={item.avatar} />
              <Text style={{flex:1, marginLeft: 40 }}>
                <Text style={{fontSize: 20, fontWeight:'bold'}}>{item.mockname}</Text>
              </Text>
              <Text style={{fontWeight:'bold', marginRight: 16}}>
                {'>'}
              </Text>
            </View>
          </Pressable>
        </Card.Content>
    </Card>
  );

  const renderNewcard = ({ item }) => (
    <Card style={styles.card} mode={'elevated'}>
     <Card.Content>
      <Pressable>
        <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
          <Avatar.Image size={40} source={item.avatar} />
           <Text style={{flex:1, marginLeft: 40}}>
             <Text style={{fontSize: 20, fontWeight:'bold'}}>{item.mockname}</Text>
           </Text>
            <Text style={{fontWeight:'bold', marginRight: 16}}>
              {'+'}
            </Text>
          </View>
        </Pressable>
      </Card.Content>
    </Card>
  );



  const [isLoading, setIsLoading] = useState(false);
  const [searchFriendsState, setSearchFriendsState] = useState(false);

  const fetchFriend = async () => {
    // try {
    //   if (!(newname == "")) {
    //     await fetch(
    //       // need a function to finds users with the username of...
    //       `http://127.0.0.1:5000/title?title=${newname}}`
    //     )
    //       .then((data) => {
    //         return data.json();
    //       })
    //       .then((data) => {
    //         setSearchFriendsData(data.results);
    //         setSearchFriendsState(true);
    //       });
    //   }
    // }catch (error) {
    //   setSearchFriendsState(false);
    //   console.error("Error fetching data: ", error);
    // }
    try {
      setSearchFriendsState(true);
      // setSearchFriendsData([{id:'10', mockname: 'Bob', avatar: require('../assets/default-avatar.jpeg')},]);
    }
    catch (error) {
      setSearchFriendsState(false);
      console.error(error);
    }
  };

  const fetchFriendsList = async () => {
    try {
      setIsLoading(true);
      if (!(newname == "")) {
        await fetch(
          // need a function to fetch the friends of the current user
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

  useEffect(() => {
    fetchFriendsList();
  }, [])

  return (
    <View style={{display:'flex',flex:1,backgroundColor: "#BBCDE5"}}>

       <View style={styles.preference}>
        <View style={styles.title}>
          <Text style={typography.title}>Melo</Text>
        </View>
      </View>

      <View style={styles.preference}>
        <Searchbar
          onChangeText={setName}
          loading={searchFriendsState}
          placeholder="Find a new Friend..."
          onSubmitEditing={fetchFriend}
          style={styles.searchbar}
          value={newname}
        />
        <View style={styles.buttonContainer}><Button style={styles.button} labelStyle={typography.default_w} onPress={fetchFriend}>
          Search
        </Button></View>
      </View>

      {searchFriendsState && <View style={{flex:6}}>
        <View style={styles.preference}>
          <View style={styles.titleContainer}>
            <Text style={typography.header}>New Friend</Text>
          </View>
        </View>
        {/* <Card style={styles.card}>
          <Card.Content>
            <Pressable>
              <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
                <Avatar.Image size={40} source={searchFriendsData.avatar} />
                <Text style={{flex:1, marginLeft: 40}}>
                  <Text style={{fontSize: 20, fontWeight:'bold'}}>{searchFriendsData.mockname}</Text>
                </Text>
                <Text style={{fontWeight:'bold', marginRight: 16}}>
                  {'+'}
                </Text>
              </View>
            </Pressable>
          </Card.Content>
        </Card> */}
        <View style={{flex:6}}>
          <FlatList
          data={searchFriendsData}
          keyExtractor={(item) => item.id}
          renderItem={renderNewcard}
          style={[styles.container]}
          contentContainerStyle={styles.content}
          />
        </View>  
      </View>
      }
     
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

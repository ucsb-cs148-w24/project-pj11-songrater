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



const snow = '#FFFBFA'

export default function FriendsScreen({ navigation }){

  const [friendsdata, setFriendsData] = useState([]);

  // const [friendsdata, setFriendData] = useState([
  //   {id:'1', mockname: 'Friend1', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'2', mockname: 'Friend2', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'3', mockname: 'Friend3', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'4', mockname: 'Friend4', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'5', mockname: 'Friend5', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'6', mockname: 'Friend6', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'7', mockname: 'Friend7', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'8', mockname: 'Friend8', avatar: require('../assets/default-avatar.jpeg')},
  //   {id:'9', mockname: 'Friend9', avatar: require('../assets/default-avatar.jpeg')},
  // ]);

  const [searchFriendsData, setSearchFriendsData] = useState([]);

  const [newname, setName] = useState("");

  const [fid, setFid] = useState(null);
  const [fexist, setFexist] = useState("");

  const renderCard= ({ item }) => (
    <Card style={styles.card} mode={'elevated'}>
        <Card.Content>
          <Pressable>
            <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
              <Avatar.Image size={40} source={item.avatar} />
              <Text style={{flex:1, marginLeft: 40 }}>
                <Text style={{fontSize: 20, fontWeight:'bold'}}>{item.username}</Text>
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
        <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
          <Avatar.Image size={40} source={item.avatar} />
           <Text style={{flex:1, marginLeft: 40}}>
             <Text style={{fontSize: 20, fontWeight:'bold'}}>{item.username}</Text>
           </Text>
           <Pressable
                onPress={() => {
                  AddFriend();
                }}
              >
                <Text style={{fontWeight:'bold', marginRight: 16}}>
                {'+'}
              </Text>
              </Pressable>
          </View>
      </Card.Content>
    </Card>
  );



  const [isLoading, setIsLoading] = useState(false);
  const [searchFriendsState, setSearchFriendsState] = useState(false);

  const fetchFriend = async() => {
    const UserId = 2;
    setIsLoading(true);
    try{
      if(newname!="")
      await fetch(`http://127.0.0.1:5000/api/search_friends_specific?user_id=${UserId}&uname=${newname}`)
        .then((data) => {
          setIsLoading(false);
          return data.json();
        })
        .then((data) => {
          setSearchFriendsData(data.results);
        });
    //   const response1 = await fetch(`http://127.0.0.1:5000/api/search_friends_specific?user_id=${UserId}&uname=${newname}`).
    //   then((response1) => response1.json());

    //   var newArr =  response1.results;
    //   newArr = newArr.filter(function( element ) {
    //     return element !== undefined;
    //  });
    //  setSearchFriendsData(newArr);

    }catch (error) {
    setIsLoading(false);
    console.error("Error fetching data: ", error);
    }
  }

  const AddFriend = async() => {
    const UserId = 2;
    try{
     await fetch(`http://127.0.0.1:5000/api/friends_exists?user_id=${UserId}&fid=${fid}`).
      then((data) => {
      return data.json();
    }).then((data) =>{
      setFexist(data.results);
    })
    }catch (error) {
      console.error("Error fetching data: ", error);
    }

    if(fexist == "You can add him/her as a friend."){
      // add friend
      await fetch(`http://127.0.0.1:5000/api/add_friend?user_id=${UserId}&fid=${fid}`).then((data) => {
        return data.json();
      });
    }
};

  const fetchFriendsList = async () => {
    const UserId = 2;
    try {
    const Friends= await fetch(
      `http://127.0.0.1:5000/api/get_friends?user_id=${UserId}`
      ).then((Friends) => Friends.json());

    //   var newArr = Friends.results;
    //   newArr = newArr.filter(function( element ) {
    //     return element !== undefined;
    //  });
     setFriendsData(Friends.results);
    }catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchFriendsList();
  }, [])


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

import React, { useState, useEffect } from 'react';
import { Pressable, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { buttons } from "./helper/Buttons";
import { Avatar, Divider, Card } from 'react-native-paper';

//<a href="https://www.flaticon.com/free-icons/panda" title="panda icons">Panda icons created by Freepik - Flaticon</a>

const mockUsername = "Username";
const mockDescription = "This is a test description!"
const mockFriendCount = 10;
const snow = '#FFFBFA'

export default function ProfileScreen({ route }) {
  const [songData, setSongData] = useState([]);

  //const [songInfo, setSongInfo] = useState([]);
  //setSongInfo(songInfo.concat());

  useEffect(() => {
    fetchUserSongList({});
  }, []);
  const fetchUserSongList = async ({}) => {
    const fetchUserSongParams = {
      user_id: 1, // HARD CODED, CHANGE ONCE OATH IS IN
    };
    const responseGood = await fetch(
      `http://127.0.0.1:5000/api/get_user_songs?user_id=${fetchUserSongParams.user_id}&type=good`
    ).then((responseGood) => responseGood.json());

    const responseOk = await fetch(
      `http://127.0.0.1:5000/api/get_user_songs?user_id=${fetchUserSongParams.user_id}&type=ok`
    ).then((responseOk) => responseOk.json());

    const responseBad = await fetch(
      `http://127.0.0.1:5000/api/get_user_songs?user_id=${fetchUserSongParams.user_id}&type=bad`
    ).then((responseBad) => responseBad.json());

    console.log(responseGood.results);
    console.log(responseOk.results);
    console.log(responseBad.results);

    var newArr = responseGood.results.concat(responseOk.results,responseBad.results)
    newArr = newArr.filter(function( element ) {
      return element !== undefined;
   });
   setSongData(newArr);
   
  };

  const handleButton = () => {};
  const renderCard = ({ item }) => (
    <Card style={styles.card} mode={'elevated'}>
      <Card.Content>
        <View style={{flex:1, flexDirection:'row'}}>
          <Text style={{flex:1}}>
            <Text style={{fontWeight:'bold'}}>{item.song_name}</Text>
            <Text>{' '}by{' '}</Text>
            <Text style={{fontWeight:'bold'}}>{item.artist_name}</Text>
          </Text>
          <Text style={{fontWeight:'bold',alignSelf:'center',marginLeft:'auto',marginRight:17}}>{item.rating}</Text>
        </View>
      </Card.Content>
    </Card>
  );
  return (
    <View style={{display:'flex',flex:1,backgroundColor: "#BBCDE5"}}>
      <View style={{flex:1,marginTop:40, marginLeft:17, marginRight:17, marginBottom:5,flexDirection:'row'}}>
        <Avatar.Image size={64} source={require('../assets/panda.png')} />
        <Text style={{flex:1, textAlign:'left',padding:15,color: '#00120B', fontSize: 30, fontWeight: 'bold'}}>
          {mockUsername}</Text>
      </View>
      <View style={{flex:1,marginLeft:75,marginRight:17,marginTop:5,marginBottom:5,borderRadius:10}}>
        <Text style={{flex:1, textAlign:'left',padding:10,color: '#A09E9E', fontSize: 15,flexWrap: 'wrap-reverse'}}>
            {mockDescription}</Text>
      </View>
         <TouchableOpacity style={{marginLeft:17,marginRight:17,marginTop:5,marginBottom:5, flex:1, borderRadius:10,justifyContent:'flex-start'}} onPress={() => handleButton()}>
          <Divider style={{height: 1.5, marginTop: 17, marginHorizontal: 17, backgroundColor : "#3187D8" }} />
          <View style={{display:'flex', flex:1, flexDirection:'row'}}>
            <Text style={{fontSize:20,alignSelf:'center',marginLeft:17}}>
              <Text style={{fontWeight:'bold'}}>{mockFriendCount}</Text>
              {' '}Friends
            </Text>
            <Text style={{fontSize:20,alignSelf:'center',marginLeft:'auto',marginRight:17}}>{">"}</Text>
          </View>
          <Divider style={{height: 1.5,marginHorizontal: 17, backgroundColor : "#3187D8" }} />
        </TouchableOpacity>
      <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.header}>Your Songs</Text>
        </View>
      </View>
      <View style={{flex:10}}>
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
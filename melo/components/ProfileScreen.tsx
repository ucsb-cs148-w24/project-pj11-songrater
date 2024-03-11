import React, { useState, useEffect } from 'react';
import { Pressable, 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  Image,
} from "react-native";
import { styles } from "./helper/Styles";
import { typography } from "./helper/Typography";
import { Avatar, Divider, Card, Button } from 'react-native-paper';

//<a href="https://www.flaticon.com/free-icons/panda" title="panda icons">Panda icons created by Freepik - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/pencil" title="pencil icons">Pencil icons created by Pixel perfect - Flaticon</a>
const mockUsername = "Username";
const mockDescription = "This is a test description!"
const mockFriendCount = 10;
const snow = '#FFFBFA';

export default function ProfileScreen({ navigation }) {
  const [uname, setUname] = useState("");
  const [description, setDescription] = useState("");
  const [songData, setSongData] = useState([]);

  const navigateEditUserScreen = ({}) => {
    navigation.navigate("EditUserScreen");
  };
  //const [songInfo, setSongInfo] = useState([]);
  //setSongInfo(songInfo.concat());
  useEffect(() => {
    fetchUserSongList({});
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    console.log('aaaaaaa');
    const user_id = 1
    const curr_info = await fetch(
      `http://127.0.0.1:5000/api/get_profile?user_id=${user_id}`
    ).then((curr_info) => curr_info.json())
    console.log(curr_info);
    try{
      setUname(curr_info.results[0].username);
      setDescription(curr_info.results[0].description);
    }
    catch{
      console.log('Error getting User Info');
    }
  }

  const fetchUserSongList = async ({}) => {
    const user_id = 1
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
    try{
      newArr = newArr.concat(responseGood.results)
      newArr = newArr.concat(responseOk.results)
      newArr = newArr.concat(responseBad.results)
    }
    catch{}
    console.log(responseGood)
    console.log(responseOk)
    console.log(responseBad)
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
    <View style={{display:'flex',flex:1,backgroundColor: "#F3F6F7"}}>
      <View style={{flex:1,marginTop:40, marginLeft:17, marginRight:17, marginBottom:5,flexDirection:'row'}}>
        <Avatar.Image size={64} source={require('../assets/panda.png')} />
        <Text style={{flex:5, textAlign:'left',padding:15,color: '#00120B', fontSize: 30, fontWeight: 'bold'}}>
          {uname}</Text>
        <Pressable style={{height:30, width:30, marginRight:20}} onPress={navigateEditUserScreen}>
          <Image style={{height:30, width:30,marginRight:20}} source={require('../assets/edit.png')}/>
        </Pressable>
      </View>
      <View style={{flex:1,marginLeft:75,marginRight:17,marginTop:5,marginBottom:5,borderRadius:10}}>
        <Text style={{flex:1, textAlign:'left',padding:10,color: '#A09E9E', fontSize: 15,flexWrap: 'wrap-reverse'}}>
            {description}</Text>
      </View>
         <Pressable style={{marginLeft:17,marginRight:17,marginTop:5,marginBottom:5, flex:1, borderRadius:10,justifyContent:'flex-start'}} onPress={() => handleButton()}>
          <Divider style={{height: 1.5, marginTop: 17, marginHorizontal: 17, backgroundColor : "#3187D8" }} />
          <View style={{display:'flex', flex:1, flexDirection:'row'}}>
            <Text style={{fontSize:20,alignSelf:'center',marginLeft:17}}>
              <Text style={{fontWeight:'bold'}}>{mockFriendCount}</Text>
              {' '}Friends
            </Text>
            <Text style={{fontSize:20,alignSelf:'center',marginLeft:'auto',marginRight:17}}>{">"}</Text>
          </View>
          <Divider style={{height: 1.5,marginHorizontal: 17, backgroundColor : "#3187D8" }} />
        </Pressable>
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
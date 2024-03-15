import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Searchbar, Avatar, Card, IconButton, Text, Paragraph, Divider } from 'react-native-paper';
import ScreenWrapper from './helper/ScreenWrapper';
import { styles } from './helper/Styles';
import { typography } from './helper/Typography';
import { useExampleTheme } from './helper/Themes';
import { buttons } from './helper/Buttons';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from 'react';
import SplashScreen from './SplashScreen';

const mockFriendCount = 10;
const snow = '#FFFBFA';
const user_id = 1;

function LandingScreen({ navigation }) {
  const [uname, setUname] = useState("");
  const [songData, setSongData] = useState([]);

  useEffect(() => {
    fetchFriendSongFeed({});
    fetchUserInfo();
  }, [useIsFocused()]);

  const fetchUserInfo = async () => {
    const curr_info = await fetch(
      `http://127.0.0.1:5000/api/get_profile?user_id=${user_id}`
    ).then((curr_info) => curr_info.json())
    try{
      setUname(curr_info.results[0].username);
    }
    catch{
      console.log('Error getting User Info');
    }
  }

  const fetchFriendSongFeed = async ({}) => {
    try{
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
      newArr = newArr.concat(responseGood.results)
      newArr = newArr.concat(responseOk.results)
      newArr = newArr.concat(responseBad.results)

      newArr = newArr.filter(function( element ) {
        return element !== undefined;
     });
     setSongData(newArr);
    }
    catch{
      console.log("Error fetching user lists")
    }
   
  };

// const LandingScreen = ({ navigation }) => {
  const { colors, isV3 } = useExampleTheme();
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedHearts, setSelectedHearts] = useState({});
  const [selectedPluses, setSelectedPluses] = useState({});
  const [data, setData] = useState([
    { id: '1', title: 'Love Story', artist: 'Taylor Swift', rating: 9.1, name: 'Amy W.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/fearless-album-cover.jpeg') },
    { id: '2', title: 'Shape of You', artist: 'Ed Sheeran', rating: 5.3, name: 'Jefferey M.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/shape-of-you-album-cover.jpeg') },
    { id: '3', title: 'Baby', artist: 'Justin Bieber', rating: 1.1, name: 'Emily H.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/shape-of-you-album-cover.jpeg') },
    { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', rating: 8.6, name: 'Collin Q.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/fearless-album-cover.jpeg') },
    { id: '5', title: 'Uptown Funk', artist: 'Bruno Mars', rating: 6.3, name: 'Anshuman D.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/shape-of-you-album-cover.jpeg') },
    { id: '6', title: 'Ocean Eyes', artist: 'Billie Eilish', rating: 7.9, name: 'Katya R.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/shape-of-you-album-cover.jpeg') },
    { id: '7', title: 'Old Town Road', artist: 'Lil Nas X', rating: 3.2, name: 'Leyang N.', avatar: require('../assets/default-avatar.jpeg'), cover: require('../assets/shape-of-you-album-cover.jpeg') },
  ]);

  const [searchQueries, setSearchQuery] = React.useState({
    searchBarMode: '',
    traileringIcon: '',
    traileringIconWithRightItem: '',
    rightItem: '',
    loadingBarMode: '',
    searchViewMode: '',
    searchWithoutBottomLine: '',
    loadingViewMode: '',
    clickableBack: '',
    clickableDrawer: '',
    clickableLoading: '',
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
      return 'green'; // High ratings
    } else if (rating >= 5 && rating <= 7.4) {
      return 'orange'; // Mediocre ratings
    } else {
      return 'red'; // Low ratings
    }
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleCardPress(item)}>
      <Card style={styles.card} mode={'elevated'}>
      {selectedCard === item.id && (
        <>
          <Card.Cover source={item.cover} />
          <View style={styles.iconContainer}>
            <View style={styles.circleBackground}>
              <IconButton
                icon={selectedPluses[item.id] ? 'plus-thick' : 'plus'}
                iconColor={selectedPluses[item.id] ? '#3187D8' : '#BBCDE5'}
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
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text> gave a{' '}
              <Text style={{ fontWeight: 'bold', color: renderRatingColor(item.rating) }}>{item.rating}</Text>
            </>
          }
          titleVariant={selectedCard === item.id ? 'headlineSmall' : 'bodyLarge'}
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
              icon={selectedHearts[item.id] ? 'heart' : 'heart-outline'}
              iconColor={selectedHearts[item.id] ? '#3187D8' : '#BBCDE5'}
              onPress={() => handleHeartPress(item)}
            />
          )}
        />

        <Card.Content>
          <TextComponent
            variant={selectedCard === item.id ? 'bodyMedium' : 'bodySmall'}
            style={{ paddingLeft: 55, paddingBottom: selectedCard === item.id ? 20 : 14 }}
          >
            to <Text style={{ fontWeight: 'bold' }}>{item.title}</Text> by{' '}
            <Text style={{ fontWeight: 'bold' }}>{item.artist}</Text>
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
        navigation.navigate("Splash")
      }
      else {
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
  }

  const Logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      navigation.navigate("Splash");
    }).catch((error) => {
      console.error("Log Out Failed")
    });
  }

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <ScrollView>
        <View style={[styles.preference, {flexDirection: 'row', justifyContent: 'space-between'}]}>
          <View style={styles.titleContainer}>
            <Text style={typography.title}>Melo</Text>
          </View>
          <View style={[buttons.primary, {width: 144, height: 48}]}>
            <Pressable style={[buttons.outline, {width: 144, height: 48}]} onPress={Logout}>
              <Text>Logout</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.preference}>
          <Searchbar
            placeholder="Rank a Song..."
            onChangeText={(query) => setSearchQuery({ ...searchQueries, searchBarMode: query })}
            value={searchQueries.searchBarMode}
            style={styles.searchbar}
            mode="bar"
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.preference}>
          <View style={styles.titleContainer}>
            <Text style={typography.header}>Your Feed</Text>
          </View>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={[styles.container]}
          contentContainerStyle={styles.content}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

LandingScreen.title = 'Landing Screen';

export default LandingScreen;

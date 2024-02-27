import React, { useState } from 'react';
import { View, ScrollView, FlatList, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Searchbar, Avatar, Card, IconButton, Text, Paragraph, Divider } from 'react-native-paper';
import ScreenWrapper from './helper/ScreenWrapper';
import { styles } from './helper/Styles';
import { typography } from './helper/Typography';
import { useExampleTheme } from './helper/Themes';

const YourListComponent = ({ navigation }) => {
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

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <ScrollView>
        <View style={styles.preference}>
          <View style={styles.titleContainer}>
            <Text style={typography.title}>Melo</Text>
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

        <Divider style={{ height: 1.5, marginTop: 17, marginHorizontal: 17, backgroundColor : "#3187D8" }} />

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

YourListComponent.title = 'Your List';

export default YourListComponent;

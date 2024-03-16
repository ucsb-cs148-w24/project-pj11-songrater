import { useState, useEffect } from "react";
import * as React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Keyboard,
  // Stylesheet
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  Searchbar,
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Paragraph,
  Divider,
} from "react-native-paper";

import { typography } from "./helper/Typography";
import { styles } from "./helper/Styles";
import { PlusIcon } from "./helper/SVGIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
import ScreenWrapper from "./helper/ScreenWrapper";
import { SERVER_URL } from "../App";

export default function SearchSongScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [review, setReview] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedMBID, setSelectedMBID] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCover, setSelectedCover] = useState("");
  const [user_id, setUserId] = useState(0);
  const [songData, setSongData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const response = fetch(`${SERVER_URL}/api/get_profile?uid=${user.uid}`)
          .then((response) => response.json())
          .then((data) => {
            setUserId(data?.results[0]?.id);
          });
      }
    });

    return sub;
  }, [navigation]);

  const SongResult = ({ songTitle, songArtist, mbid, date, cover }) => {
    const updateSelectedStateVariables = () => {
      setModalVisible(true);
      setSelectedTitle(songTitle);
      setSelectedArtist(songArtist);
      setSelectedMBID(mbid);
      setSelectedDate(date);
      setSelectedCover(cover);
    };

    return (
      <Pressable
        onPress={updateSelectedStateVariables}
        style={[
          styles.songResultContainer,
          {
            backgroundColor: modalVisible ? "rgba(255,255,255,0.3)" : "white",
          },
        ]}
      >
        <View style={styles.songValueContainer}>
          <Text style={typography.default_bold}>{songTitle}</Text>
          <Text style={typography.default_d}>{songArtist}</Text>
        </View>
      </Pressable>
    );
  };

  const navigateRateSong = ({ rating }) => {
    setModalVisible(false);
    navigation.navigate("RateSong", {
      rating: rating,
      title: selectedTitle,
      artist: selectedArtist,
      review: review,
      mbid: selectedMBID,
      date: selectedDate,
      cover: selectedCover,
      user_id: user_id,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchSong = async () => {
    try {
      setIsLoading(true);
      if (!(title == "" && artist == "")) {
        await fetch(`${SERVER_URL}/title?title=${title}&artist=${artist}`)
          .then((data) => {
            setIsLoading(false);
            return data.json();
          })
          .then((data) => {
            setSongData(data.results);
          });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  const [isVisible, setIsVisible] = React.useState(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.preference}>
        <View style={styles.titleContainer}>
          <Text style={typography.title}>Melo</Text>
        </View>
      </View>

      <View style={styles.preference}>
        <Searchbar
          value={title}
          onChangeText={setTitle}
          loading={isLoading}
          placeholder="Enter a Title..."
          onSubmitEditing={fetchSong}
          style={styles.searchbar}
        />
      </View>
      <Pressable onPress={fetchSong}>
        <Text style={styles.enterButton}>Search</Text>
      </Pressable>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.OuterView}>
          <View style={styles.ModalContainer}>
            <View style={styles.ModalInformationContainer}>
              <View style={styles.SongInformationContainer}>
                <Text style={typography.header2}>{selectedTitle}</Text>
                <Text style={typography.header2}>By: {selectedArtist}</Text>
              </View>
              <View style={styles.RatingInformationContainer}>
                <TextInput
                  value={review}
                  onChangeText={setReview}
                  placeholder="Leave your review..."
                  style={[typography.default_d, styles.reviewInput]}
                  multiline={true}
                  numberOfLines={5}
                ></TextInput>
                <Text style={[typography.default_l, { flex: 1, padding: 5 }]}>
                  Rate how you like the song!
                </Text>
              </View>
            </View>
            <View style={styles.ModalRatingContainer}>
              <Pressable
                onPress={() => {
                  navigateRateSong({ rating: "good" });
                }}
                style={styles.GoodButton}
              >
                <Text style={typography.default_d}>Great</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigateRateSong({ rating: "ok" });
                }}
                style={styles.OkayButton}
              >
                <Text style={typography.default_d}>Okay</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigateRateSong({ rating: "bad" });
                }}
                style={styles.BadButton}
              >
                <Text style={typography.default_d}>Bad</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.flatListContainer}>
        <FlatList
          data={songData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <SongResult
              songTitle={item.title}
              songArtist={item.artist}
              mbid={item.mbid}
              date={item.release_date}
              cover={item.image}
            />
          )}
        />
      </View>
    </View>
  );
}

//Surface, Segmented Buttons, List.Accordian, Progress Bar?

// List.Item for showing results, Divider if needed
// OR Music Player (Inside Segmented Buttons) for listing songs

// Dialog for rating popup
// Segmented Buttons for rating

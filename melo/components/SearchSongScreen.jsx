import { useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { typography } from "./helper/Typography";
import { PlusIcon } from "./helper/SVGIcons";

export default function SearchSongScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedMBID, setSelectedMBID] = useState("");
  const [songData, setSongData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const SongResult = ({ songTitle, songArtist, mbid }) => {
    const updateSelectedStateVariables = () => {
      setModalVisible(true);
      setSelectedTitle(songTitle);
      setSelectedArtist(songArtist);
      setSelectedMBID(mbid);
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
          <Text style={typography.default}>{songArtist}</Text>
        </View>
      </Pressable>
    );
  };

  const SongRatings = {
    GREAT: 0,
    OKAY: 1,
    BAD: 2,
  };

  const navigateRateSong = ({ rating }) => {
    setModalVisible(false);
    navigation.navigate("RateSong", {
      rating: rating,
      title: selectedTitle,
      artist: selectedArtist,
      mbid: selectedMBID,
    });
  };

  const fetchSong = async () => {
    try {
      if (title != "" && artist != "") {
        await fetch(
          `http://127.0.0.1:5000/title?title=${title}&artist=${artist}`
        )
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            setSongData(data.results);
          });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a Title"
          onSubmitEditing={fetchSong}
          style={[typography.default, styles.textInput]}
        />
        <TextInput
          value={artist}
          onChangeText={setArtist}
          placeholder="Enter an Artist"
          onSubmitEditing={fetchSong}
          style={[typography.default, styles.textInput]}
        />
      </View>
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
                <Text style={typography.default_l}>
                  Rate how you like the song!
                </Text>
              </View>
            </View>
            <View style={styles.ModalRatingContainer}>
              <Pressable
                onPress={() => {
                  navigateRateSong({ rating: SongRatings.GREAT });
                }}
                style={styles.GoodButton}
              >
                <Text style={typography.default}>Great</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigateRateSong({ rating: SongRatings.OKAY });
                }}
                style={styles.OkayButton}
              >
                <Text style={typography.default}>Okay</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigateRateSong({ rating: SongRatings.BAD });
                }}
                style={styles.BadButton}
              >
                <Text style={typography.default}>Bad</Text>
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
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FFFAEA",
    padding: 30,
  },
  searchContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  textInput: {
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    margin: 10,
  },
  songResultContainer: {
    flex: 1,
    padding: 20,
    margin: 10,
    marginRight: "4rem",
    marginLeft: "4rem",
    borderRadius: 15,
    flexDirection: "row",
    border: "black",
    borderWidth: StyleSheet.hairlineWidth,
  },
  songValueContainer: {
    flexDirection: "column",
    gap: 5,
  },
  flatListContainer: {
    flex: 2,
  },
  ModalContainer: {
    height: "25%",
    width: "60%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 15,
  },
  ModalInformationContainer: {
    flex: 1.5,
    padding: 10,
  },
  SongInformationContainer: {
    alignItems: "flex-start",
    padding: 10,
  },
  RatingInformationContainer: {
    padding: 25,
    alignItems: "center",
  },
  ModalRatingContainer: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-around",
    flex: 1,
  },
  GoodButton: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#B1E59F",
    borderRadius: 50,
    height: 80,
    width: 80,
  },
  OkayButton: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#FFEFB4",
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  BadButton: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#E59F9F",
    borderRadius: 50,
    height: 80,
    width: 80,
  },
  OuterView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});

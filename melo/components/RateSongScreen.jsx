import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
// import { styles } from "./helper/Styles";
import { useCallback, useState, useEffect } from "react";
import { objectToUrlParams } from "./helper/functions";

function linspace(startValue, endValue, num, index) {
  const arr = [];
  const step = (endValue - startValue) / (num - 1);
  for (let i = 0; i < num; i++) {
    arr.push(startValue + step * i);
  }
  return arr[index];
}

export default function RateSongScreen({ route }) {
  const { rating, title, artist, review, mbid, date, cover } = route.params;
  const [indices, setIndices] = useState({
    leftIndex: 0,
    rightIndex: 1,
    currentIndex: 1,
  });
  const [doneRanking, setDoneRanking] = useState(false);
  const [ready, setReady] = useState(false);
  const [userSongs, setUserSongs] = useState({});

  useEffect(() => {
    console.log(`rating: ${rating}`);
    fetchUserSongs({ rating });
    setDoneRanking(false);
  }, []);

  useEffect(() => {
    console.log(
      `indices: [${indices.leftIndex}, ${indices.rightIndex}, ${indices.currentIndex}], doneRanking: ${doneRanking}`
    );
    if (doneRanking) {
      console.log(`user song has been added.`);
      addUserSong();
    }
  }, [doneRanking]);

  const addUserSong = async () => {
    const addUserSongParams = {
      user_id: 1, // TODO : change once we get valid user IDs
      song_id: mbid,
      rank: indices.currentIndex,
      review: review,
      type: rating,
    };

    const response = await fetch(
      "http://127.0.0.1:5000/api/add_song?" +
        objectToUrlParams(addUserSongParams),
      {
        method: "POST",
      }
    ).then((response) => console.log(response));
  };

  const fetchUserSongs = async ({ rating }) => {
    const fetchUserSongParams = {
      type: rating,
      user_id: 1, // TODO : change once we get valid user IDs
    };

    const response = await fetch(
      `http://127.0.0.1:5000/api/get_user_songs?user_id=1&type=${rating}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(`data.results: ${data.results}`);
        if (!data?.results || data.results.length === 0) {
          console.log("trigger 1");
          setDoneRanking(true);
        } else {
          console.log("trigger 2");
          console.log(data);
          setUserSongs(data.results);
          setIndices({
            leftIndex: 1,
            rightIndex: data.results.length,
            currentIndex: Math.floor(data.results.length / 2),
          });
          console.log(indices);
          setReady(true);
        }
      });

    console.log(response);
  };

  const updateIndices = useCallback((status) => {
    setIndices((prevState) => {
      let newLeft = prevState.leftIndex;
      let newRight = prevState.rightIndex;

      if (status === "new") {
        newRight = prevState.currentIndex - 1;
        if (newRight == -1) {
          newRight = 0;
          setDoneRanking(true);
        }
      } else if (status === "old") {
        newLeft = prevState.currentIndex + 1;
      }

      const newCurrent = Math.floor((newLeft + newRight) / 2);

      // Logging for debugging
      console.log(`left: ${newLeft}, right: ${newRight}, curr: ${newCurrent}`);

      if (newRight < newLeft) {
        setDoneRanking(true);
      }

      return {
        leftIndex: newLeft,
        rightIndex: newRight,
        currentIndex: newCurrent,
      };
    });
  }, []);

  const RateSongComponent = ({ title, artist, review, rating, status }) => {
    return (
      <Pressable
        onPress={() => updateIndices(status)}
        style={({ pressed }) => [
          styles.songContainer,
          pressed
            ? {
                shadowColor: "black",
                shadowRadius: 10,
                shadowOpacity: 1,
              }
            : {},
        ]}
      >
        <Text style={typography.header}>{title}</Text>
        <Text style={typography.header2}>{artist}</Text>
        <Text style={typography.default}>Review: {review}</Text>
      </Pressable>
    );
  };

  if (userSongs.length > 0) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={typography.header}>Choose which song you prefer!</Text>
        </View>
        <View style={styles.rateSongContainer}>
          <RateSongComponent
            title={title}
            artist={artist}
            review={review}
            status={"new"}
          />
          {console.log(
            `currentIndex: ${indices.currentIndex}, userSongs: ${userSongs}`
          )}
          <RateSongComponent
            title={userSongs[indices.currentIndex].song_name}
            artist={userSongs[indices.currentIndex].artist}
            review={userSongs[indices.currentIndex].review}
            status={"old"}
          />
        </View>
        {doneRanking ? (
          <View style={styles.resultContainer}>
            <Text style={typography.header2}>
              New Rank: {indices.currentIndex + 1}
            </Text>
            <Text style={typography.header2}>
              Calibrated Rating:{" "}
              {linspace(
                10.0,
                7.0,
                userSongs.length + 1,
                indices.currentIndex - 1
              )}
            </Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={typography.header}>Song has been added!</Text>
        </View>
        <View style={styles.rateSongContainer}>
          <RateSongComponent
            title={title}
            artist={artist}
            review={review}
            status={"new"}
          />
        </View>
        {doneRanking ? (
          <View style={styles.resultContainer}>
            <Text style={typography.header2}>
              New Rank: {indices.currentIndex}
            </Text>
            <Text style={typography.header2}>
              Calibrated Rating:{" "}
              {linspace(10.0, 7.0, userSongs.length + 1, indices.currentIndex)}
            </Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateSongContainer: {
    flex: 3,
    alignItems: "center",
    padding: 20,
  },
  songContainer: {
    backgroundColor: "white",
    padding: 15,
    margin: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
    height: "30%",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});

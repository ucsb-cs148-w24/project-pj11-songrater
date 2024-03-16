import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
// import { styles } from "./helper/Styles";
import { useCallback, useState, useEffect } from "react";
import { objectToUrlParams } from "./helper/functions";
import { SERVER_URL } from "../App";

function linspace(rating, num, index) {
  let endValue;
  let startValue;
  if (rating == "good") {
    startValue = 7.0;
    endValue = 10.0;
  } else if (rating == "ok") {
    startValue = 4.0;
    endValue = 7.0;
  } else if (rating == "bad") {
    startValue = 0.0;
    endValue = 4.0;
  }
  if (isNaN(num)) {
    num = 1;
  }
  const arr = [];
  let step = 0;
  if (num - 1 <= 1) {
    step = endValue - startValue;
  } else {
    step = (endValue - startValue) / num;
  }
  for (let i = 0; i < num; i++) {
    arr.push(endValue - step * i);
  }
  return Math.round(arr[index] * 10) / 10;
}

export default function RateSongScreen({ route }) {
  const { rating, title, artist, review, mbid, date, cover, user_id } =
    route.params;
  const [indices, setIndices] = useState({
    leftIndex: 0,
    rightIndex: 0,
    currentIndex: 0,
  });
  const [doneRanking, setDoneRanking] = useState(false);
  const [userSongs, setUserSongs] = useState({});
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    fetchUserSongs({ rating });
    setDoneRanking(false);
  }, []);

  useEffect(() => {
    if (doneRanking) {
      addUserSong();
    }
  }, [doneRanking]);

  const addUserSong = async () => {
    const addUserSongParams = {
      user_id: user_id, // TODO : change once we get valid user IDs
      song_id: mbid,
      rank: indices.currentIndex + 1,
      review: review,
      type: rating,
    };

    const response = await fetch(
      `${SERVER_URL}/api/add_song?" + objectToUrlParams(addUserSongParams)`,
      {
        method: "POST",
      }
    );
  };

  const fetchUserSongs = async ({ rating }) => {
    const response = await fetch(
      `${SERVER_URL}/api/get_user_songs?user_id=${user_id}&type=${rating}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data?.results || data.results.length === 0) {
          setDoneRanking(true);
        } else {
          setUserSongs(data.results);
          setIndices({
            leftIndex: 0,
            rightIndex: data.results.length - 1,
            currentIndex: Math.floor((data.results.length - 1) / 2),
          });
        }
      });
  };

  const updateIndices = useCallback(async (status) => {
    let newLeft;
    let newRight;
    setIndices((prevState) => {
      newLeft = prevState.leftIndex;
      newRight = prevState.rightIndex;

      if (status === "new") {
        newRight = prevState.currentIndex - 1;
        if (newRight == -1) {
          newRight = 0;
          setDoneRanking(true);
        }
      } else if (status === "old") {
        newLeft = prevState.currentIndex + 1;
        if (newLeft == userSongs.length) {
          newLeft = userSongs.length - 1;
        }
      }
      let newCurrent;
      if (newRight == -1) {
        newCurrent = 1;
      } else {
        newCurrent = Math.ceil((newLeft + newRight) / 2);
      }

      return {
        leftIndex: newLeft,
        rightIndex: newRight,
        currentIndex: newCurrent,
      };
    });
    if (newRight < newLeft || (userSongs.length < 2 && newRight <= newLeft)) {
      setDoneRanking(true);
      setFinish(true);
    }
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

  if (userSongs.length > 0 && !finish) {
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
          <RateSongComponent
            title={userSongs[indices.currentIndex].song_name}
            artist={userSongs[indices.currentIndex].artist_name}
            review={userSongs[indices.currentIndex].review}
            status={"old"}
          />
          {doneRanking ? (
            <View style={styles.resultContainer}>
              <Text style={typography.header2}>
                New Rank: {indices.currentIndex + 1}
              </Text>
              <Text style={typography.header2}>
                Calibrated Rating:{" "}
                {linspace(rating, userSongs.length + 1, indices.currentIndex)}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
        </View>
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
              Calibrated Rating:{" "}
              {linspace(rating, userSongs.length + 1, indices.currentIndex)}
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

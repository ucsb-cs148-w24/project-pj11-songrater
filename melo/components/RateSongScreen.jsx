import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
import { useCallback, useState } from "react";

const mockData = [
  {
    song_id: 7,
    artist: "Megan Thee Stallion",
    song_name: "Hiss",
    rank: "1",
    review: "An electrifying track with a powerful performance.",
  },
  {
    song_id: 13,
    artist: "Jack Harlow",
    song_name: "Lovin On Me",
    rank: "2",
    review: "A catchy tune that's climbing the charts rapidly.",
  },
  {
    song_id: 68,
    artist: "Taylor Swift",
    song_name: "Cruel Summer",
    rank: "3",
    review: "An emotional rollercoaster packed into a song.",
  },
  {
    song_id: 45,
    artist: "Teddy Swims",
    song_name: "Lose Control",
    rank: "4",
    review: "A soulful ballad that resonates with many.",
  },
  {
    song_id: 80,
    artist: "Tate Mcrae",
    song_name: "Greedy",
    rank: "5",
    review: "An energetic song that gets you moving.",
  },
  {
    song_id: 36,
    artist: "Zach Bryan and Kacey Musgraves",
    song_name: "I Remember Everything",
    rank: "6",
    review: "A heartfelt story turned into a beautiful melody.",
  },
  {
    song_id: 5,
    artist: "Doja Cat",
    song_name: "Agora Hills",
    rank: "7",
    review: "A dynamic hit with an unforgettable rhythm.",
  },
  {
    song_id: 50,
    artist: "Benson Boone",
    song_name: "Beautiful Things",
    rank: "8",
    review: "A track that showcases true musical talent.",
  },
  {
    song_id: 78,
    artist: "21 Savage",
    song_name: "Redrum",
    rank: "9",
    review: "A bold and raw piece that captivates listeners.",
  },
  {
    song_id: 37,
    artist: "SZA",
    song_name: "Snooze",
    rank: "10",
    review: "A smooth and catchy number with a cool vibe.",
  },
];

function linspace(startValue, endValue, num, index) {
  const arr = [];
  const step = (endValue - startValue) / (num - 1);
  for (let i = 0; i < num; i++) {
    arr.push(startValue + step * i);
  }
  return arr[index];
}

export default function RateSongScreen({ route }) {
  const { rating, title, artist, review, mbid } = route.params;
  const [indices, setIndices] = useState({
    leftIndex: 0,
    rightIndex: mockData.length - 1,
    currentIndex: Math.floor((mockData.length - 1) / 2),
  });
  const [doneRanking, setDoneRanking] = useState(false);

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

  const fetchUserSongs = ({ rating }) => {};

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
          title={mockData[indices.currentIndex].song_name}
          artist={mockData[indices.currentIndex].artist}
          review={mockData[indices.currentIndex].review}
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
            {linspace(10.0, 7.0, mockData.length + 1, indices.currentIndex)}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}

/**
 * UseEffect to get all songs that the user has (future case, right now just MockData)
 *
 * When user selects a song, this should be inserted into the database with unique MBID
 * When getting all of a user's songs, backend should join this data
 *
 * Would be also nice to get 'last updated'
 */

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

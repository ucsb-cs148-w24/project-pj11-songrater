import { Text, View } from "react-native";

export default function RateSongScreen({ route }) {
  const { rating, title, artist, mbid } = route.params;

  const fetchUserSongs = ({ rating }) => {};

  return (
    <View>
      <Text>
        rating: {rating}, title: {title}, artist: {artist}, mbid: {mbid}
      </Text>
    </View>
  );
}

/**
 * UseEffect to get all songs that the user has (future case, right now just MockData)
 *
 * When user selects a song, this should be inserted into the database with unique MBID
 * When getting all of a user's songs, backend should join this data
 */

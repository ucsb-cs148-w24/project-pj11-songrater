import { useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { typography } from "./helper/Typography";
import { PlusIcon } from "./helper/SVGIcons";

function SongResult({ title, artist }) {
  return (
    <View style={styles.songResultContainer}>
      <View style={styles.songValueContainer}>
        <Text style={typography.default_bold}>{title}</Text>
        <Text style={typography.default}>{artist}</Text>
      </View>
      <Pressable>
        <PlusIcon />
      </Pressable>
    </View>
  );
}

export default function SearchSongScreen() {
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>;
  const [title, setTitle] = useState("");
  const [titleData, setTitleData] = useState([]);

  const fetchTitles = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/title?title=${title}`)
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          console.log(data.results);
          setTitleData(data.results);
        });
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
          placeholder="Enter a title"
          onSubmitEditing={fetchTitles}
          style={[typography.default, styles.textInput]}
        />
      </View>
      <View></View>
      <FlatList
        data={titleData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <SongResult title={item.title} artist={item.artist} />
        )}
      />
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
  },
  songResultContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
  },
  songValueContainer: {
    flexDirection: "column",
    gap: 5,
  },
});

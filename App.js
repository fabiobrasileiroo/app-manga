import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
const { getAnimeData, searchManga, countChapters } = require("./api.js");

const statusBarHeight = Constants.statusBarHeight;

const ScreenHeight = Dimensions.get("window").height;

export default function App() {
  console.log(ScreenHeight)
  const [mangas, setMangas] = useState([]);
  const [manga, setManga] = useState("");
  const [chapter, setChapter] = useState("");
  const [totalChapters, setTotalChapters] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mangaSlug, setMangaSlug] = useState("");
  const [mangaFound, setMangaFound] = useState(false);

  const searchAndUpdateManga = async () => {
    setIsLoading(true);
    setMangaFound(false);
    try {
      const slug = await searchManga(manga);
      setMangaSlug(slug);
      const count = await countChapters(slug);
      setTotalChapters(count);
      setMangaFound(true);
    } catch (error) {
      console.error("Error searching manga:", error.message);
      setTotalChapters(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMangas = async () => {
    setIsLoading(true);
    try {
      const { images } = await getAnimeData(mangaSlug || manga, chapter);
      setMangas(images);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderImage = ({ item }) => (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="contain"
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.searchContainer}>
        <Text style={styles.label}>Manga:</Text>
        <View style={styles.pesquisa}>
          <TextInput
            style={styles.input}
            value={manga}
            onChangeText={setManga}
            placeholder="Enter manga name"
          />
          <View style={styles.buttonPesquisa}>
            <Button 
              title="Search Manga"
              onPress={searchAndUpdateManga}
              color="#4CAF50"
              disabled={!manga || isLoading}
            />
          </View>
        </View>

        {mangaFound && (
          <>
            <Text style={styles.label}>Chapter: {totalChapters}</Text>
            <View style={styles.pesquisa}>
              <TextInput
                style={styles.input}
                value={chapter}
                onChangeText={setChapter}
                keyboardType="numeric"
                placeholder="Enter chapter number"
              />
              <View style={styles.buttonPesquisa}>
                <Button
                  title="Fetch Chapter"
                  onPress={fetchMangas}
                  color="#6200EE"
                  disabled={
                    !chapter || isLoading || parseInt(chapter) > totalChapters
                  }
                />
              </View>
            </View>
            {/* <Text>Total Chapters: {totalChapters}</Text> */}

          </>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <FlatList style
          data={mangas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderImage}
          contentContainerStyle={styles.imageContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  searchContainer: {
    marginVertical: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  pesquisa: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 18,
    // marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 30,
    width: "60%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  buttonPesquisa: {
    // height: 38,
    marginLeft: 12 
  },
  imageWrapper: {
    width: "100%",
    height: ScreenHeight -175,
    // flex: 1,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    paddingBottom: 0,
  },
});

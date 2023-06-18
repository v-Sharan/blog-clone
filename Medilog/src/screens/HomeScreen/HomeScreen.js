import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Alert,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { EvilIcons } from "@expo/vector-icons";
import { Blogs, LoadingModel } from "../../components";
import { useFocusEffect } from "@react-navigation/native";
import { Overlay } from "@rneui/themed";

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState(null);
  const [allBlogs, setAllBlogs] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const { data, refetch, isLoading, isFetched, isRefetching } = useQuery(
    "blogs",
    () => {
      return axios.get("http:192.168.160.177:8080/postBlog");
    }
  );
  const { width } = useWindowDimensions();
  const firstTimeRef = useRef(true);

  useEffect(() => {
    setAllBlogs(data?.data);
  }, [data?.data]);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allBlogs.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.topic) ||
        regex.test(item.discription)
    );
  };

  const handleSearch = () => {
    if (!searchText) {
      Alert.alert("Search with a keyword");
      return;
    }
    clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(searchText);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <React.Fragment>
      <View style={[styles.mainContainer, { width: width - 80 }]}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
          />
          {searchText ? (
            <EvilIcons
              name="close-o"
              size={32}
              style={styles.icon}
              color="black"
              onPress={() => {
                setSearchText(null);
                setSearchTimeout(
                  setTimeout(() => {
                    setSearchedResults(null);
                  }, 500)
                );
              }}
            />
          ) : (
            <EvilIcons
              name="search"
              size={32}
              color="black"
              style={styles.icon}
            />
          )}
        </View>
        <TouchableOpacity onPress={handleSearch} style={styles.SearchContainer}>
          <Text style={styles.text}>Search</Text>
        </TouchableOpacity>
      </View>
      {data?.data.length === 0 && (
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            width: width - 100,
            alignSelf: "center",
            borderRadius: 15,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 50 }}>No Blogs</Text>
        </View>
      )}
      {isLoading && (
        <LoadingModel isLoading={isLoading && isFetched && isRefetching} />
      )}
      <FlatList
        data={!!searchedResults ? searchedResults : allBlogs}
        key={({ item }) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Blogs {...item} />}
      />
    </React.Fragment>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    marginBottom: 10,
    width: "95%",
    alignSelf: "center",
  },
  mainContainer: {
    alignSelf: "flex-start",
    padding: 10,
    flexDirection: "row",

    gap: 10,
  },
  SearchContainer: {
    width: "30%",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "black",
    alignItems: "center",
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderRadius: 10,
    flex: 1,
  },
  icon: { alignSelf: "center" },
  text: {
    fontWeight: "bold",
    color: "white",
  },
});

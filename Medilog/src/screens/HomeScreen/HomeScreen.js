import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { useQuery } from "react-query";
import axios from "axios";

const HomeScreen = () => {
  const { handleLogout, user } = useAuth();
  const { data, isLoading } = useQuery("blogs", () => {
    return axios.get("http:192.168.185.177:8080/postBlog");
  });

  console.log(data?.data[0]?.image);

  return (
    <View>
      <Text>Home</Text>
      <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
      <FlatList
        data={data?.data}
        key={({ item }) => item._id}
        renderItem={({ item }) => (
          <Image
            source={{
              uri: `http:192.168.185.177:8080/${item.image}`,
              width: 100,
              height: 100,
            }}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

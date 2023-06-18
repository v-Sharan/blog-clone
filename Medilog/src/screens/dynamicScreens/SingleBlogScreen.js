import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Skeleton } from "@rneui/themed";

const SingleBlogScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { width, height } = useWindowDimensions();
  const { data, isLoading } = useQuery(`${id}`, () => {
    return axios.get(`http:192.168.160.177:8080/postBlog/blog/${id}`);
  });

  const date = new Date(data?.data?.createdAt).toDateString();

  return (
    <SafeAreaView>
      <ScrollView>
        {isLoading && (
          <>
            <Pressable
              style={styles.header}
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons name="chevron-back" size={30} color="black" />
            </Pressable>
            <View
              style={[
                styles.container,
                { width: width - 50, flexDirection: "row", gap: 10 },
              ]}
            >
              <Skeleton circle width={40} height={40} />
              <Skeleton width={120} height={40} />
            </View>
            <Divider
              width={0.6}
              style={{
                marginVertical: 10,
                width: width - 50,
                alignSelf: "center",
              }}
            />
            <Skeleton
              width={120}
              height={height - 200}
              style={{ width: width - 50, alignSelf: "center" }}
            />
          </>
        )}
        {!isLoading && (
          <>
            <Pressable
              style={styles.header}
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons name="chevron-back" size={30} color="black" />
            </Pressable>
            <View style={[styles.container, { width: width - 50 }]}>
              <Text style={styles.topic}>{data?.data?.topic}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ borderRadius: 50 }}
                    source={{
                      // uri: `http:192.168.160.177:8080/${data?.data?.creator.userPhoto}`,
                      uri: data?.data?.creator.userPhoto,
                      width: 20,
                      height: 20,
                    }}
                  />
                  <Text
                    style={{ paddingLeft: 6, color: "grey", fontWeight: "600" }}
                  >
                    {data?.data?.creator.username}
                  </Text>
                </View>
                <Text>{date}</Text>
              </View>
              <Divider width={0.6} style={{ marginVertical: 10 }} />
              <View style={styles.discription}>
                <Text style={{ fontSize: 20 }}>{data?.data?.discription}</Text>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: `http:192.168.160.177:8080/${data?.data?.image}`,
                    width: width - 50,
                    height: width - 70,
                  }}
                  style={{ marginVertical: 10, borderRadius: 20 }}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleBlogScreen;

const styles = StyleSheet.create({
  header: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  container: {
    alignSelf: "center",
    marginVertical: 10,
  },
  topic: {
    fontSize: 27,
    marginBottom: 20,
  },
  discription: {
    margin: 10,
  },
});

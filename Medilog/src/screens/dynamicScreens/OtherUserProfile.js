import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Blogs, LoadingModel } from "../../components";
import { Ionicons, Entypo } from "@expo/vector-icons";
import axios from "axios";
import { useQuery } from "react-query";
import { useCallback, useRef, useEffect } from "react";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";

dayjs.extend(calendar);

const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";
const bg = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg";

const profilePictureWidth = Dimensions.get("window").width * 0.4;

const OtherUserPRofile = ({ user }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: bg }} style={styles.bg} />
      <Image
        source={{ uri: user?.userPhoto || dummy_img }}
        style={styles.image}
      />

      <Text style={styles.name}>{user.username}</Text>

      <View style={styles.textLine}>
        <Entypo
          name="graduation-cap"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>Graduated College</Text>
      </View>
      <View style={styles.textLine}>
        <Entypo
          name="graduation-cap"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>Profession</Text>
      </View>
      <View style={styles.textLine}>
        <Entypo
          name="graduation-cap"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>Current working place</Text>
      </View>

      <View style={styles.textLine}>
        <Ionicons name="time" size={18} color="gray" style={{ width: 25 }} />
        <Text>Joined on {dayjs().calendar(dayjs(user.createdAt))}</Text>
      </View>

      <View style={styles.textLine}>
        <Entypo
          name="location-pin"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>From Tenerife</Text>
      </View>
    </View>
  );
};

const ProfileScreen = ({ route }) => {
  const firstTimeRef = useRef(true);
  const { userId } = route?.params;
  const navigation = useNavigation();

  const { data, refetch, isLoading, isRefetching, isFetching } = useQuery(
    "BlogsByID",
    () => {
      return axios.get(
        `http:192.168.160.177:8080/postBlog/blogByUser/${userId}`
      );
    }
  );

  useEffect(() => {
    navigation.setOptions({ title: data?.data?.user?.username });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
  return (
    <FlatList
      data={data?.data?.user?.blogs}
      renderItem={({ item }) => (
        <Blogs
          userImg={data?.data?.user?.userPhoto}
          userName={data?.data?.user?.username}
          refetch={refetch}
          {...item}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <>
          <LoadingModel isLoading={isLoading || isFetching || isRefetching} />
          <OtherUserPRofile user={data?.data?.user} />
          <Text style={styles.sectionTitle}>Blogs</Text>
          {data?.data?.user?.blogs.length === 0 && (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                alignSelf: "center",
                borderRadius: 15,
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 50 }}>
                No Blogs
              </Text>
            </View>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    padding: 10,
  },
  bg: {
    width: "100%",
    height: 200,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: -profilePictureWidth / 2,
  },
  image: {
    width: profilePictureWidth,
    aspectRatio: 1,
    borderRadius: 500,
    borderWidth: 5,
    borderColor: "white",
  },
  name: {
    fontWeight: "500",
    fontSize: 16,
    marginVertical: 5,
  },
  buttonsContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  button: {
    alignSelf: "stretch",
    flexDirection: "row",
    backgroundColor: "gainsboro",
    margin: 5,
    padding: 7,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    marginHorizontal: 5,
    fontWeight: "500",
  },
  textLine: {
    alignSelf: "stretch",
    alignItems: "center",
    marginVertical: 5,
    flexDirection: "row",
  },
  sectionTitle: {
    marginLeft: 10,
    marginVertical: 5,
    fontWeight: "500",
    fontSize: 18,
  },
});

export default ProfileScreen;

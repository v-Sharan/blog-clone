import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Blogs, LoadingModel } from "../../components";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useAuth } from "../../../context/auth";
import axios from "axios";
import { useQuery } from "react-query";
import { useCallback, useRef } from "react";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";

dayjs.extend(calendar);

const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";
const bg = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg";

const profilePictureWidth = Dimensions.get("window").width * 0.4;

const ProfileScreenHeader = ({ user, isMe = false }) => {
  const { handleLogout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: user?.bg ? "https://medilog.onrender.com/" + user?.bg : bg,
        }}
        style={styles.bg}
      />
      <Image
        source={{
          uri: user?.userPhoto
            ? "https://medilog.onrender.com/" + user?.userPhoto
            : dummy_img,
        }}
        style={styles.image}
      />
      <Text style={styles.name}>{user.username}</Text>
      {isMe && (
        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Edit Screen", { id: user?.id })}
          >
            <MaterialCommunityIcons name="pencil" size={16} color="black" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            style={[
              styles.button,
              { flex: 0, width: 50, backgroundColor: "red" },
            ]}
          >
            <MaterialIcons name="logout" size={16} color="white" />
          </Pressable>
        </View>
      )}

      <View style={styles.textLine}>
        <Ionicons name="time" size={18} color="gray" style={{ width: 25 }} />
        <Text>Joined on {dayjs().calendar(dayjs(user.createdAt))}</Text>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const { user, token } = useAuth();
  const firstTimeRef = useRef(true);

  const { data, refetch, isLoading, isRefetching, isFetching } = useQuery(
    "BlogsByID",
    () => {
      return axios.get(
        `https://medilog.onrender.com/postBlog/blogByUser/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  );

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
          userImg={user.userPhoto}
          isMe={true}
          userName={user.username}
          refetch={refetch}
          {...item}
          creatorid={data?.data?.user?._id}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <>
          <LoadingModel isLoading={isLoading || isFetching || isRefetching} />
          <ProfileScreenHeader user={user} isMe={true} />
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

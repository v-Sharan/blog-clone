import {
  Text,
  Image,
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import DeleteModel from "./DeleteModel";
import { useAuth } from "../../context/auth";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";

dayjs.extend(calendar);

const Blogs = ({
  creator,
  discription,
  topic,
  image,
  createdAt,
  _id,
  userImg,
  userName,
  isMe = false,
  refetch,
}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const date = dayjs().calendar(dayjs(createdAt));
  const [deleteBlog, setDeleteBlog] = useState(false);
  const { user } = useAuth();
  const GoProfile = () => {
    if (creator?._id === user.id) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("OtherProfile Screen", { userId: creator?._id });
    }
  };

  return (
    <View style={[styles.post, { width: width - 20 }]}>
      <Pressable onPress={GoProfile}>
        <View style={styles.header}>
          <Image
            source={{ uri: creator.userPhoto || userImg }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>{creator.username || userName}</Text>
            <Text style={styles.subtitle}>{date}</Text>
          </View>
          <Entypo
            name="dots-three-horizontal"
            size={18}
            color="gray"
            style={styles.icon}
          />
        </View>
      </Pressable>
      <Text style={styles.topic}>{topic}</Text>
      <Text style={styles.description}>{discription}</Text>
      {image && (
        <Image
          source={{
            uri: `http:192.168.160.177:8080/${image}`,
            width: width - 50,
            height: width - 50,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.footer}>
        <View style={styles.buttonsRow}>
          <CustomButton
            text="Read More"
            bgColor={"black"}
            fgColor="white"
            onPress={() => navigation.navigate("SingleBlogScreen", { id: _id })}
          />
        </View>
        {isMe && (
          <View style={styles.iconButton}>
            <CustomButton
              text="Edit"
              bgColor={"blue"}
              fgColor="white"
              onPress={() =>
                navigation.navigate("EditBlog Screen", { id: _id })
              }
            />
            <CustomButton
              text="Delete"
              bgColor={"red"}
              fgColor="white"
              onPress={() => setDeleteBlog(true)}
            />
          </View>
        )}
        {deleteBlog && (
          <DeleteModel
            deleteBlog={deleteBlog}
            setDeleteBlog={setDeleteBlog}
            id={_id}
            refetch={refetch}
          />
        )}
      </View>
    </View>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  post: {
    backgroundColor: "#fff",
    marginVertical: 5,
    alignSelf: "center",
    padding: 10,
    borderRadius: 10,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: "500",
  },
  subtitle: {
    color: "gray",
  },
  icon: {
    marginLeft: "auto",
  },
  description: {
    lineHeight: 10,
    padding: 10,
    color: "grey",
  },
  topic: {
    lineHeight: 30,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 5,
  },
  footer: {
    paddingHorizontal: 10,
  },

  buttonsRow: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    gap: 10,
  },
  iconButtonText: {
    color: "gray",
    marginLeft: 5,
    fontWeight: "500",
  },
});

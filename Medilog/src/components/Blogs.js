import {
  Text,
  Image,
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";

const Blogs = ({ creator, discription, topic, image, createdAt, _id }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const date = new Date(createdAt).toDateString();
  return (
    <View style={[styles.post, { width: width - 20 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => console.warn(creator?.username)}>
          <Image
            source={{ uri: creator.userPhoto }}
            style={styles.profileImage}
          />
        </Pressable>
        <View>
          <Text style={styles.name}>{creator.username}</Text>
          <Text style={styles.subtitle}>{date}</Text>
        </View>
        <Entypo
          name="dots-three-horizontal"
          size={18}
          color="gray"
          style={styles.icon}
        />
      </View>
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
          <View style={styles.iconButton}>
            <CustomButton
              text="Read More"
              bgColor={"black"}
              fgColor="white"
              onPress={() =>
                navigation.navigate("SingleBlogScreen", { id: _id })
              }
            />
          </View>
        </View>
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
  },
  iconButtonText: {
    color: "gray",
    marginLeft: 5,
    fontWeight: "500",
  },
});

import {
  Text,
  Image,
  View,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Blogs = ({ blog }) => {
  const date = new Date(blog.createdAt).toDateString();
  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image
          source={{ uri: blog.creator.userPhoto }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>{blog.creator.username}</Text>
          <Text style={styles.subtitle}>{date}</Text>
        </View>
        <Entypo
          name="dots-three-horizontal"
          size={18}
          color="gray"
          style={styles.icon}
        />
      </View>

      <Text style={styles.description}>{blog.discription}</Text>
      {blog.image && (
        <Image
          source={{ uri: blog.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.footer}>
        <View style={styles.buttonsRow}>
          <Pressable style={styles.iconButton}>
            <TouchableOpacity>
              <View style={styles.iconButton}>
                <AntDesign name="like2" size={18} color={"royalblue"} />
                <Text style={[styles.iconButtonText, { color: "royalblue" }]}>
                  Like
                </Text>
              </View>
            </TouchableOpacity>
          </Pressable>
          <View style={styles.iconButton}>
            <FontAwesome5 name="comment-alt" size={16} color="gray" />
            <Text style={styles.iconButtonText}>Comment</Text>
          </View>
          <View style={styles.iconButton}>
            <MaterialCommunityIcons
              name="share-outline"
              size={18}
              color="gray"
            />
            <Text style={styles.iconButtonText}>Share</Text>
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
    lineHeight: 20,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  footer: {
    paddingHorizontal: 10,
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    borderColor: "lightgray",
  },
  likeIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  likedBy: {
    color: "gray",
  },
  shares: {
    color: "gray",
    marginLeft: "auto",
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

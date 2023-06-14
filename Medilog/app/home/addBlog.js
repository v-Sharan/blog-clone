import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { CustomButton, CustomInput } from "../../components";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAuth } from "../../context/auth";

const addBlog = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm();
  const blog = { discription: "" };
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540sago_sharan%252FMedilog/ImagePicker/0bfb9859-ef75-43d8-aba8-6259f4f4b31c.jpeg"
  );

  const handlePostBlog = (data) => {
    setIsLoading(true);
    const BlogData = { ...data, creator: user?.id };
    axios
      .post("http://192.168.185.177:8080/post/blog", BlogData)
      .then((res) => {
        Alert.alert(res.data.message);
        ToastAndroid.show(res.data.message, ToastAndroid.CENTER);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch((err) => console.log(err.response.data))
      .finally(() => {
        reset(blog);
        setIsLoading(false);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.back()} style={styles.backbutton}>
        <Ionicons name="arrow-back" size={22} color="white" />
      </TouchableOpacity>
      <Text style={styles.CreateText}>Create a Blog</Text>
      <View style={styles.viewCreate}>
        <Text style={styles.discription}>Discription:</Text>
        <CustomInput
          name="discription"
          placeholder="Discription"
          type={"text"}
          control={control}
          rules={{ required: "Discription is required" }}
          multiline
        />
        <Image
          source={{ uri: image }}
          style={{
            width: "100%",
            aspectRatio: 4 / 3,
          }}
        />
        <CustomButton
          bgColor="blue"
          onPress={pickImage}
          color="white"
          title="upload"
          bdColor="white"
          width={100}
        />
        <View style={styles.postButton}>
          <CustomButton
            bgColor="blue"
            onPress={handleSubmit(handlePostBlog)}
            color="white"
            title="Post"
            bdColor="white"
            width={100}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default addBlog;

const styles = StyleSheet.create({
  backbutton: {
    position: "absolute",
    top: 40,
    padding: 10,
    left: 10,
    backgroundColor: "black",
    borderRadius: 70,
  },
  CreateText: {
    position: "absolute",
    color: "black",
    left: 70,
    top: 50,
    fontSize: 30,
  },
  viewCreate: {
    top: 60,
    padding: 20,
  },
  discription: {
    fontSize: 20,
  },
  postButton: {
    alignItems: "flex-end",
    padding: 10,
  },
});

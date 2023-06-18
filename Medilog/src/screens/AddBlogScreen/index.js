import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
  Image,
  Text,
  KeyboardAvoidingView,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { CustomInput, CustomButton, LoadingModel } from "../../components";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../context/auth";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { user } = useAuth();
  const [fileName, setFileName] = useState(null);
  const [ext, setExt] = useState(null);

  const { control, handleSubmit, reset } = useForm();

  const handlePost = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("creator", user.id);
    formData.append("image", {
      name: fileName,
      uri: image,
      type: `image/${ext}`,
    });
    formData.append("topic", data.topic);
    formData.append("discription", data.discription);

    axios
      .post("http:192.168.160.177:8080/postBlog/blog", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        Alert.alert(res.data.message);
        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);
      })
      .catch((err) => console.log(err.response))
      .finally(() => setLoading(false));
    reset({ topic: "", discription: "" });
    setImage(null);
  };

  const handleReset = () => {
    +reset({ topic: "", discription: "" });
    setImage(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });

    if (!result.canceled) {
      const filename = result.assets[0].uri.split("/").pop();
      const split = filename.split(".");
      setFileName(split[0]);
      setExt(split[1]);
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={150}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.root, { maxHeight: height }]}>
          {loading && <LoadingModel isLoading={loading} />}
          <CustomInput
            title="Topic:"
            name="topic"
            placeholder="Topic"
            control={control}
            rules={{ required: "Topic is required" }}
          />
          <CustomInput
            title="Discription:"
            name="discription"
            placeholder="Discription"
            control={control}
            rules={{ required: "Topic is required" }}
          />
          <View style={styles.imageHelperView}>
            <Text style={styles.font}>Add Image:</Text>
            <Text style={styles.imageHelperText}>
              (Click below image to add)
            </Text>
          </View>
          <TouchableOpacity style={styles.imagePreview} onPress={pickImage}>
            <Image
              source={
                image ? { uri: image } : require("../../assets/preview.png")
              }
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: width - 40, alignSelf: "center" }}>
          <CustomButton
            text="Post"
            type="SECONDARY"
            onPress={handleSubmit(handlePost)}
          />
          <CustomButton text="Reset" type="PRIMARY" onPress={handleReset} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
  },
  logo: {
    width: "70%",
    maxHeight: 200,
  },
  font: {
    fontSize: 20,
    paddingVertical: 10,
  },
  imageHelperView: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageHelperText: {
    padding: 5,
  },
  imagePreview: {
    height: 250,
    width: 250,
    borderRadius: 20,
    backgroundColor: "#ccc",
    paddingVertical: 5,
    alignSelf: "center",
    marginVertical: 15,
  },
});

export default LoginScreen;

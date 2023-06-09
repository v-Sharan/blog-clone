import React, { useState, useEffect } from "react";
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
import { useQuery } from "react-query";
import axios from "axios";
import { CheckBox } from "@rneui/themed";

const EditBlog = ({ navigation, route }) => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { user, token } = useAuth();
  const [fileName, setFileName] = useState(null);
  const [ext, setExt] = useState(null);
  const [changeImage, setChangeImage] = useState(false);
  const { data } = useQuery("Blog", () => {
    return axios.get(
      `https://medilog.onrender.com/postBlog/blog/${route?.params?.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  });

  useEffect(() => {
    setValue("topic", data?.data?.topic);
    setValue("discription", data?.data?.discription);
  }, [data?.data]);

  const { control, handleSubmit, reset, setValue } = useForm();

  const handlePost = (data) => {
    setLoading(true);
    console.log(changeImage);
    const formData = new FormData();
    formData.append("creator", user.id);
    if (changeImage) {
      formData.append("image", {
        name: fileName,
        uri: image,
        type: `image/${ext}`,
      });
    }
    formData.append("topic", data.topic);
    formData.append("discription", data.discription);

    axios
      .patch(
        `http:192.168.160.177:8080/postBlog/blog/edit/${route?.params?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        Alert.alert(res.data.message);
        setTimeout(() => {
          navigation.navigate("Profile");
        }, 1000);
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
      })
      .finally(() => setLoading(false));
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
            multiline
            numberOfLines={10}
            editable
            maxLength={400}
            control={control}
            rules={{ required: "Topic is required" }}
          />
          <View style={styles.imageHelperView}>
            <Text style={styles.font}>Add Image:</Text>
            <Text style={styles.imageHelperText}>
              (Click below image to add)
            </Text>
          </View>
          <CheckBox
            title={"Change Image"}
            checked={changeImage}
            onPress={() => setChangeImage((prev) => !prev)}
          />
          {changeImage && (
            <TouchableOpacity style={styles.imagePreview} onPress={pickImage}>
              <Image
                source={
                  image ? { uri: image } : require("../../assets/preview.png")
                }
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </TouchableOpacity>
          )}
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

export default EditBlog;

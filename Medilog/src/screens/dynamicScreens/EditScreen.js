import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Image,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { CustomInput, CustomButton, LoadingModel } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../context/auth";
import { useNavigation } from "@react-navigation/native";

const profilePictureWidth = Dimensions.get("window").width;

const EditScreen = ({ route }) => {
  const [fileName, setFileName] = useState(null);
  const [ext, setExt] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { data, isLoading, isFetching, isRefetching } = useQuery("user", () => {
    return axios.get(`http:192.168.160.177:8080/user/${route?.params?.id}`);
  });

  const { handleUpdate: updateFunction } = useAuth();

  useEffect(() => {
    setValue("username", data?.data?.user.username);
  }, [data?.data]);

  const { control, handleSubmit, reset, setValue } = useForm();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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

  const handleUpdate = (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("image", {
      name: fileName,
      uri: image,
      type: `image/${ext}`,
    });

    axios
      .patch(`http:192.168.160.177:8080/user/${route?.params?.id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        Alert.alert(res.data.message);
        updateFunction(res.data.user.username, res.data.user.userPhoto);
        setTimeout(() => {
          navigation.navigate("Profile");
        }, 1000);
      })
      .catch((err) => Alert.alert(err.response.data.message))
      .finally(() => setLoading(false));
    reset({ username: "" });
    setImage(null);
  };

  const handleReset = () => {
    reset({ username: "" });
    setImage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={150}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoadingModel
          isLoading={isLoading || isRefetching || isFetching || loading}
        />
        <View style={{ maxWidth: 500, maxHeight: 500 }}>
          <Image
            source={{
              uri: image
                ? image
                : "http:192.168.160.177:8080/" + data?.data?.user.userPhoto,
            }}
            resizeMode="contain"
            style={[{ width: "100%", height: "100%" }, styles.imagePreview]}
          />
          <MaterialCommunityIcons
            onPress={pickImage}
            style={{
              position: "absolute",
              backgroundColor: "royalblue",
              bottom: 30,
              left: 220,
              borderRadius: 50,
              padding: 5,
            }}
            name="pencil"
            size={22}
            color="white"
          />
        </View>
        <View style={styles.formView}>
          <CustomInput
            title="User Name"
            name="username"
            placeholder="User Name"
            control={control}
            rules={{ required: "User Name is required" }}
          />
          <CustomButton
            text="Confirm"
            type="PRIMARY"
            onPress={handleSubmit(handleUpdate)}
          />
          <CustomButton
            text="Reset"
            bgColor={"red"}
            fgColor="white"
            onPress={handleReset}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  imagePreview: {
    height: 150,
    width: 150,
    borderRadius: 180,
    alignSelf: "center",
    marginVertical: 20,
  },
  formView: {
    width: profilePictureWidth - 50,
    alignSelf: "center",
    marginVertical: 20,
  },
});

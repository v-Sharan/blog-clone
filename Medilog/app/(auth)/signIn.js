import {
  Image,
  useWindowDimensions,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { CustomInput, Model, GoogleLogo, CustomButton } from "../../components";
import { useForm } from "react-hook-form";
import { Feather } from "@expo/vector-icons";

import axios from "axios";
import { useRouter } from "expo-router";

const signIn = () => {
  const { height } = useWindowDimensions();
  const router = useRouter();
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm();

  const handleRegister = (data) => {
    setIsLoading(true);
    axios
      .post("http://192.168.185.177:8080/user/auth/signup", data)
      .then((res) => {
        Alert.alert(res.data.message, "Go to login");
        ToastAndroid.show("Registered Sucessfully", ToastAndroid.CENTER);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      })
      .catch((err) => {
        Alert.alert(err.response.data.message, "Try Again!");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView>
      {isLoading && <Model isLoading={isLoading} />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" && "padding"}
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={110}
          style={{
            padding: 20,
            width: "100%",
            maxHeight: height - 120,
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            resizeMode="contain"
            style={[
              {
                width: "70%",
                maxWidth: 400,
                maxHeight: 150,
                alignSelf: "center",
              },
              { height: height * 0.5 },
            ]}
          />
          <Text style={{ textAlign: "center", fontSize: 35 }}>
            Medilog Sign up
          </Text>
          <CustomInput
            name="username"
            placeholder="Username"
            type={"text"}
            control={control}
            rules={{ required: "Username is required" }}
          />
          <CustomInput
            name="email"
            placeholder="Email"
            type={"email"}
            control={control}
            rules={{ required: "Email is required" }}
          />
          <CustomInput
            name="password"
            type={"password"}
            placeholder="Password"
            secureTextEntry={secureText}
            control={control}
            icon={
              <Feather
                name={`${secureText ? "eye-off" : "eye"}`}
                size={20}
                color="black"
                style={{ padding: 4 }}
                onPress={() => setSecureText((prev) => !prev)}
              />
            }
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password should be minimum 6 characters long",
              },
            }}
          />
          <CustomButton
            bgColor={"black"}
            color="white"
            onPress={handleSubmit(handleRegister)}
            title="Register"
            bdColor={"white"}
          />
          <CustomButton
            bgColor={"#fff"}
            color="black"
            onPress={() => router.push("/login")}
            title="Go to Login"
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              marginVertical: 20,
              fontSize: 20,
            }}
          >
            -----or-----
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "lightgrey",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              gap: 10,
              borderWidth: 0.5,
              borderRadius: 10,
            }}
          >
            <GoogleLogo />
            <Text style={{ color: "black", fontWeight: "700" }}>
              Sign up with Google
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;

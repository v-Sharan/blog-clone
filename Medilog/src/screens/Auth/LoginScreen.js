import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
  ToastAndroid,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { CustomInput, CustomButton } from "../../components";
import LoginSVG from "../../assets/svg/login";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../../../context/auth";

const LoginScreen = () => {
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const { handleLogin } = useAuth();

  const { control, handleSubmit, reset } = useForm();

  const onSignInPressed = async (data) => {
    setLoading(true);
    axios
      .post("http:192.168.160.177:8080/user/login", data)
      .then((res) => {
        ToastAndroid.show("Login Successfully", ToastAndroid.SHORT);
        setTimeout(() => {
          handleLogin(res.data.user, res.data.token);
        }, 1000);
      })
      .catch((err) => {
        Alert.alert("Error Occured", err.response.data.message);
        ToastAndroid.show("Registration faild", ToastAndroid.SHORT);
      })
      .finally(() => setLoading(false));
    reset({ email: "", password: "" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={150}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: "center" }}>
          <LoginSVG
            height={300}
            width={300}
            style={{ transform: [{ rotate: "-5deg" }] }}
          />
        </View>
        <Text style={styles.header}>Medilog Login</Text>
        <View style={[styles.root, { maxHeight: height }]}>
          <CustomInput
            name="email"
            placeholder="Email"
            mode={"email"}
            control={control}
            rules={{ required: "Email is required" }}
          />

          <CustomInput
            name="password"
            placeholder="Password"
            secureTextEntry={secureText}
            control={control}
            icon={
              <Feather
                name={secureText ? "eye" : "eye-off"}
                size={24}
                color="black"
                style={{ paddingRight: 5, alignSelf: "center" }}
                onPress={() => setSecureText((prev) => !prev)}
              />
            }
            rules={{
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password should be minimum 3 characters long",
              },
            }}
          />
        </View>
        <View style={{ width: width - 40, alignSelf: "center" }}>
          <CustomButton
            text="Login"
            bgColor={"black"}
            fgColor="white"
            onPress={handleSubmit(onSignInPressed)}
            loading={loading}
          />
          <CustomButton
            text="Dont't have an account? Go to Register"
            type="PRIMARY"
            onPress={() => navigation.navigate("Signup")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "70%",
    maxHeight: 200,
  },
  header: {
    textAlign: "center",
    fontSize: 30,
    padding: 10,
  },
});

export default LoginScreen;

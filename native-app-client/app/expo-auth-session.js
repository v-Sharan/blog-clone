import { useEffect, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import axios from "axios";

import { EXPO_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID } from "@env";
import { useRouter } from "expo-router";

import { useAuth } from "../context/auth";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState(null);
  const { user, token: jwtToken, setUserFunc, setTokenFunc } = useAuth();

  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      if (token) {
        getUserInfo();
      }
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await axios.post(
        "http://192.168.185.177:8080/user/auth/signup",
        { token }
      );

      const user = response.data;
      setUserFunc(user.user._id);
      setTokenFunc(user.jwtToken);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  if (user && jwtToken) {
    router.push("/home");
  }

  return (
    <View style={styles.container}>
      {user === null && (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

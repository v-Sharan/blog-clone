import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "773235941412-104mhg0dl8trk4gku54k476mro0pl56f.apps.googleusercontent.com",
    androidClientId:
      "773235941412-2jkmtfhkjdj055l1f7jttt63o1cmgjh4.apps.googleusercontent.com",
    webClientId:
      "773235941412-s2t6us08h7p4pk2cc2s8n06qcsm1vu6r.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log(response.authentication.accessToken);
      setToken(response.authentication.accessToken);
      if (token) {
        getUserInfo();
      }
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await axios.post(
        "http://10.0.21.113:8080/user/auth/signup",
        { token }
      );

      const user = response.data;
      console.log(user);
      setUserInfo(user.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo === null ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Text style={styles.text}>{userInfo.username}</Text>
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

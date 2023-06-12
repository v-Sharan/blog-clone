import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "866660091623-kk8i66cufcv1t3tcccittgh3feo1akgd.apps.googleusercontent.com",
    expoClientId:
      "866660091623-1gh74uqe9blsn73fefojjqvc05nou6p8.apps.googleusercontent.com",
    androidClientId:
      "866660091623-ddr0n6qpt73u7paqp7ob8jtaesi7q4cp.apps.googleusercontent.com",
    iosClientId:
      "866660091623-6g28hk9oiom1o3eo5muv14l9gp2cqjjl.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
      console.log(user);
    } catch (error) {
      console.warn(error);
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
        <Text style={styles.text}>{userInfo.name}</Text>
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

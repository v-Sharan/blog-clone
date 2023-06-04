import { useRouter, useSegments } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = React.createContext({
  user: null,
  token: null,
  setUserFunc: (user) => {},
  setTokenFunc: (token) => {},
  logOutFunc: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function Provider(props) {
  const [userState, setUserState] = useState(null);
  const [tokenState, setTokenState] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!userState) {
      console.log("index");
      router.replace("/");
    } else if (userState) {
      console.log("home");
      router.replace("/home");
    }
  }, [userState]);

  const handleStateUser = async (user) => {
    try {
      await AsyncStorage.setItem("@userId", user._id);
      setUserState(user);
    } catch (error) {
      console.log(error);
    }
  };
  const handleStateToken = async (token) => {
    await AsyncStorage.setItem("@jwtToken_key", token);
    setTokenState(token);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@userId");
      await AsyncStorage.removeItem("@jwtToken_key");
      setUserState(null);
      setTokenState(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: userState,
        token: tokenState,
        setUserFunc: handleStateUser,
        setTokenFunc: handleStateToken,
        logOutFunc: handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

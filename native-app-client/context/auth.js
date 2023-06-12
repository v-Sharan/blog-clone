import { useRouter } from "expo-router";
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
    if (!userState && !tokenState) {
      router.replace("/");
    } else if (userState && tokenState) {
      router.replace("/home/index");
    }
  }, [userState, tokenState]);

  useEffect(() => {
    handleGetToken();
  }, []);

  const handleGetToken = async () => {
    try {
      const token = await AsyncStorage.getItem("@jwtToken_key");
      const user = await AsyncStorage.getItem("@userId");
      if (user && token) {
        handleStateToken(token);
        handleStateUser(user);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStateUser = async (user) => {
    try {
      await AsyncStorage.setItem("@userId", user);
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
      console.warn("Logout");
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

import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext({
  user: null,
  token: null,
  handleSigin: (user, token) => {},
  handleLogout: () => {},
  setuser: () => {},
  setToken: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function Provider(props) {
  const [user, setuser] = useState(null);
  const [token, setToken] = useState(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    handleFindLogin();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup && !token) {
      router.replace("/signIn");
    } else if (user && inAuthGroup && token) {
      router.replace("/");
    }
  }, [user, segments, token]);

  const handleFindLogin = async () => {
    try {
      const userStore = await SecureStore.getItemAsync("user");
      const tokenStore = await SecureStore.getItemAsync("token");
      if (userStore && tokenStore) {
        setuser(JSON.parse(userStore));
        setToken(tokenStore);
      } else {
        setToken(null);
        setuser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSigin = async (user, token) => {
    SecureStore.setItemAsync("user", JSON.stringify(user))
      .then(() => {
        setuser(user);
      })
      .catch((err) => console.log(err));
    SecureStore.setItemAsync("token", token)
      .then(() => setToken(token))
      .catch((err) => console.log(err));
  };
  const handleLogout = async () => {
    SecureStore.deleteItemAsync("user")
      .then(() => setuser(null))
      .catch((err) => console.log(err));
    SecureStore.deleteItemAsync("token")
      .then(() => setToken(null))
      .catch((err) => console.log(err));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        handleSigin,
        handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = React.createContext({
  user: {},
  token: null,
  handleLogin: (user, token) => {},
  handleLogout: () => {},
  login: null,
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function Provider(props) {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    handleFindLogin();
  }, []);

  useEffect(() => {
    if (user && token) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [user, token]);

  const handleFindLogin = async () => {
    const user = await SecureStore.getItemAsync("user");
    const token = await SecureStore.getItemAsync("token");
    if (user && token) {
      handleFirstLogin(user, token);
    } else {
      setLogin(false);
    }
  };

  const handleFirstLogin = (user, token) => {
    setUser(JSON.parse(user));
    setToken(token);
  };

  const handleLogin = (user, token) => {
    SecureStore.setItemAsync("user", JSON.stringify(user))
      .then((res) => setUser(user))
      .catch((err) => console.log(err));
    SecureStore.setItemAsync("token", token)
      .then((res) => setToken(token))
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    SecureStore.deleteItemAsync("user")
      .then(() => setUser({}))
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
        handleLogin,
        handleLogout,
        login,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

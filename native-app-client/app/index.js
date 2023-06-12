import { Redirect } from "expo-router";

import { useAuth } from "../context/auth";

export default () => {
  const { user } = useAuth();
  if (user) {
    return <Redirect href={"/home"} />;
  }
  return <Redirect href={"/expo-auth-session"} />;
};

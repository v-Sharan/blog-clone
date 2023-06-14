import { Tabs } from "expo-router";
import { Ionicons } from "react-native-vector-icons";
import { Entypo } from "@expo/vector-icons";

export default () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarLabelPosition: "beside-icon",
        tabBarLabelStyle: { fontSize: 18, fontWeight: "300" },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="signIn"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: "Register",
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="login" size={size} color={color} />
          ),
          tabBarLabel: "Log in",
        }}
      />
    </Tabs>
  );
};

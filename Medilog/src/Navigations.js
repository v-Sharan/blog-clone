import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/auth";

import {
  LoginScreen,
  HomeScreen,
  SignUpScreen,
  AddBolgScreen,
  ProfileScreen,
  SettingScreen,
  SingleBlogScreen,
} from "./screens";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function Tabs({ navigation }) {
  const { user } = useAuth();
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingLeft: 10 }}
              onPress={() => navigation.navigate("Profile")}
            >
              <Image
                source={{ uri: user?.userPhoto, width: 40, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={30}
              color="black"
              style={{ paddingRight: 10 }}
            />
          ),
          title: `Welcome ${user?.userName}!`,
        }}
      />

      <Tab.Screen
        name="Add Blog"
        component={AddBolgScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="md-add-circle-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { login } = useAuth();

  return (
    <>
      {login ? (
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Tab" component={Tabs} />
            <Stack.Screen
              name="SingleBlogScreen"
              component={SingleBlogScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default Navigator;

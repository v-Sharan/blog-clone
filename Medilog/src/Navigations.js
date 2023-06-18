import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../context/auth";

import {
  LoginScreen,
  HomeScreen,
  SignUpScreen,
  AddBolgScreen,
  ProfileScreen,
  SettingScreen,
  SearchScreen,
} from "./screens";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function Tabs({ navigation }) {
  const { user } = useAuth();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 4 }}
              onPress={() => navigation.navigate("Profile")}
            >
              <Image
                source={{ uri: user?.userPhoto, width: 40, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 5,
                backgroundColor: "#DDD",
                padding: 5,
                borderRadius: 10,
              }}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="ios-menu-sharp" size={30} color="black" />
            </TouchableOpacity>
          ),
          title: "",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search-sharp" size={size} color={color} />
          ),
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
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingScreen}
        options={{ headerShown: true }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { login } = useAuth();

  return (
    <>
      {login ? (
        <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={DrawerNavigation} />
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

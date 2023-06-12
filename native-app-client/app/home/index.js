import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import { useAuth } from "../../context/auth";

const Page = () => {
  const { logOutFunc } = useAuth();
  return (
    <View>
      <Text>Page</Text>
      <TouchableOpacity onPress={() => logOutFunc()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "../../context/auth";

const index = () => {
  const ctx = useAuth();
  console.log(ctx);

  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

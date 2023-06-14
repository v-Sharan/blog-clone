import { Image, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../../context/auth";
import { Link } from "expo-router";

const RightHeader = () => {
  const { user } = useAuth();
  return (
    <Link href={"/profile"} asChild>
      <TouchableOpacity style={{ padding: 14 }}>
        <Image
          source={{
            uri: user?.userPhoto,
          }}
          resizeMode="cover"
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    </Link>
  );
};

export default RightHeader;

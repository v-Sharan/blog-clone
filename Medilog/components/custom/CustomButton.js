import { Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ bgColor, onPress, color, title, bdColor, width }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: bdColor ? bdColor : "black",
        width: width ? width : "100%",
      }}
      onPress={onPress}
    >
      <Text style={{ color: color, textAlign: "center", fontSize: 20 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

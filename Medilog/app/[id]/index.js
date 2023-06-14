import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router";

const index = () => {
  const { id } = useSearchParams();
  return (
    <View>
      <Text>{id}</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});

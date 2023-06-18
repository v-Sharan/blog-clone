import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Overlay } from "@rneui/themed";

const LoadingModel = ({ isLoading }) => {
  return (
    <Overlay isVisible={isLoading} overlayStyle={styles.modalView}>
      <View style={{ padding: 20 }}>
        <ActivityIndicator size={"large"} color={"#00ff00"} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </Overlay>
  );
};

export default LoadingModel;

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: { marginTop: 15 },
});

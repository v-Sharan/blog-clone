import { View, Text, Modal, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";

const ModelComponent = ({ isLoading }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isLoading}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={"large"} color={"#00ff00"} />
          <Text>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ModelComponent;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
});

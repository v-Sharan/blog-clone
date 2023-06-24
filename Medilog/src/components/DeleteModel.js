import { Alert, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import { Overlay } from "@rneui/themed";
import CustomButton from "./CustomButton";
import axios from "axios";

const DeleteModel = ({ deleteBlog, id, setDeleteBlog, refetch }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http:192.168.160.177:8080/postBlog/blog/${id}`)
      .then((res) => {
        ToastAndroid.show("Deleted Blog", ToastAndroid.SHORT);
        refetch();
        setDeleteBlog(false);
      })
      .catch((err) => Alert.alert(err.response.data.message))
      .finally(() => setLoading(false));
  };
  return (
    <Overlay isVisible={deleteBlog} overlayStyle={styles.modalView}>
      <View style={{ padding: 20 }}>
        <Text>Are you Sure want to Delete this Blog</Text>
        <View style={styles.iconButton}>
          <CustomButton
            text="Cancel"
            bgColor={"blue"}
            fgColor="white"
            onPress={() => setDeleteBlog(false)}
          />
          <CustomButton
            text="Delete"
            bgColor={"red"}
            fgColor="white"
            onPress={() => handleDelete(id)}
            loading={loading}
          />
        </View>
      </View>
    </Overlay>
  );
};

export default DeleteModel;

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
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    gap: 10,
  },
});

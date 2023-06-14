import { FlatList, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Blogs, Model } from "../../components";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "react-query";

const Home = () => {
  const { height } = useWindowDimensions();
  const [image, setImage] = useState(null);
  const { data, isLoading, isFetching } = useQuery("blogs", () =>
    axios.get("http://192.168.185.177:8080/post")
  );

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  return (
    <>
      {isLoading && <Model isLoading={isLoading && isFetching} />}
      <FlatList
        style={{ maxHeight: height - 140 }}
        showsVerticalScrollIndicator={false}
        data={data?.data}
        key={({ item }) => item._id}
        renderItem={({ item }) => <Blogs blog={item} />}
      />
    </>
  );
};

export default Home;

import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";

const NewsFeed = () => {
  const router = useRouter();
  const { docs } = useSelector((state: RootState) => state.auth);
  const [newsList, setNews] = useState<
    { id: string; title: string; detail: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _callApi();
  }, []);

  const _callApi = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://e-jpas.wu.ac.th/img.php");
      setNews(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ height: 200, width: "100%", marginBottom: 15 }}>
      {!loading && (
        <Swiper
          showsButtons={false}
          loop={true}
          autoplay={true}
          autoplayTimeout={5}
          paginationStyle={{ bottom: -20 }}
          dotStyle={{
            backgroundColor: "#FFD0BC",
            width: 8,
            height: 8,
          }}
          activeDotStyle={{
            backgroundColor: theme.colors.primary,
            width: 8,
            height: 8,
          }}
        >
          {newsList.map((item, index) => (
            <View
              key={index}
              style={{ flex: 1, position: "relative", marginBottom: 20 }}
            >
              <Image
                source={{
                  uri: item.src,
                }}
                style={{ width: "100%", height: 200 }}
              />
            </View>
          ))}
        </Swiper>
      )}
    </View>
  );
};

export default NewsFeed;

const styles = StyleSheet.create({});

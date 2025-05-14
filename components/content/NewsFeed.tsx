import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Swiper from "react-native-swiper";
import axios from "axios";
import { theme } from "@/core/theme";

const NewsFeed = () => {
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
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff80",
          }}
        >
          <ActivityIndicator
            size="large"
            animating={true}
            color={theme.colors.primary}
          />
        </View>
      )}
      {!loading && (
        <Swiper
          showsButtons={false}
          loop={true}
          autoplay={true}
          autoplayTimeout={5}
          paginationStyle={{ bottom: -20 }}
          dotStyle={{
            backgroundColor: theme.colors.primary,
            width: 8,
            height: 8,
          }}
          activeDotStyle={{
            backgroundColor: "#FF893A",
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

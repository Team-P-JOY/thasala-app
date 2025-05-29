import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

const index = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <CustomBackground>
      <CustomTopBar title="ประกาศ" back={() => router.replace("/home")} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <CustomText bold style={{ fontSize: 20 }}>
            เร็วๆนี้
          </CustomText>
        </View>
      </ScrollView>
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({});

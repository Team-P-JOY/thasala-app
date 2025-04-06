import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import React, { useState } from "react";
import CustomBackground from "@/components/CustomBackground";
import CustomTopBar from "@/components/CustomTopBar";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomText from "@/components/CustomText";

const index = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <CustomBackground>
      <CustomTopBar title="สแกน" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CustomText>test</CustomText>
      </ScrollView>
      <CustomFooterBar />
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({});

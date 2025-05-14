import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import React, { useState } from "react";
import CustomBackground from "@/components/CustomBackground";
import CustomTopBar from "@/components/CustomTopBar";
import WebPortal from "@/components/WebPortal";
import { useRouter } from "expo-router";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";

const index = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const url = "https://e-jpas.wu.ac.th/mobile.php?personid=" + user?.personid;
  return (
    <CustomBackground>
      <CustomTopBar title="สวัสดิการ" back={() => router.push("/home")} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WebPortal url={url} />
      </ScrollView>
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({});

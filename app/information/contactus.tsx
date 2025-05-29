import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
      <CustomTopBar title="ติดต่อเรา" back={() => router.replace("/home")} />
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
          <Image
            resizeMode="contain"
            source={require("@/assets/images/thasala-main.png")}
            style={{ height: 200 }}
          />
          <CustomText
            style={{
              color: theme.colors.primary,
              fontSize: 14,
              paddingVertical: 20,
            }}
          >
            มีข้อสงสัยหรือคำแนะนำ สามารถติดต่อเราได้ที่
          </CustomText>

          <CustomText bold style={{ color: theme.colors.primary }}>
            ศูนย์เทคโนโลยีดิจิทัล มหาวิทยาลัยวลัยลักษณ์
          </CustomText>
          <CustomText style={{ color: theme.colors.primary }}>
            075-673-400 (08.30-16.30)
          </CustomText>
        </View>
      </ScrollView>
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({});

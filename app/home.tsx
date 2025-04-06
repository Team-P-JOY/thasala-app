import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomBackground from "@/components/CustomBackground";
import { theme } from "@/core/theme";
import { Appbar, Avatar } from "react-native-paper";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import CustomFooterBar from "@/components/CustomFooterBar";

const home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <CustomBackground>
      <Appbar.Header style={{ backgroundColor: "transparent", elevation: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={require("@/assets/images/slider2.png")}
            style={{ width: 100, height: 45, marginRight: 10 }}
            resizeMode="contain"
          />
        </View>
        <Appbar.Action icon="qrcode" color={theme.colors.primary} size={30} />
        <View>
          <Avatar.Image
            size={45}
            style={styles.avatar}
            source={{ uri: user?.avatar || "https://i.pravatar.cc/150?img=3" }}
          />
        </View>
      </Appbar.Header>
      <ScrollView></ScrollView>
      <CustomFooterBar />
    </CustomBackground>
  );
};

export default home;

const styles = StyleSheet.create({
  avatar: {
    marginRight: 7,
  },
});

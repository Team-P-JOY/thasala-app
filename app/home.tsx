import {
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
} from "react-native";
import React, { useState } from "react";
import CustomBackground from "@/components/CustomBackground";
import { theme } from "@/core/theme";
import { Appbar, Avatar } from "react-native-paper";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import CustomFooterBar from "@/components/CustomFooterBar";
import NewsFeed from "@/components/content/NewsFeed";
import Announce from "@/components/content/Announce";
import MenuContent from "@/components/content/MenuContent";
import PotalProgram from "@/components/content/PotalProgram";

const home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <CustomBackground>
      <Appbar.Header style={{ backgroundColor: "transparent", elevation: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={require("@/assets/images/logo.png")}
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ marginBottom: 60 }}
      >
        <NewsFeed />
        <Announce />
        <MenuContent />
        <PotalProgram />
      </ScrollView>

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

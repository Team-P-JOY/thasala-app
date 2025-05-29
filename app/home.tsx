import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import Announce from "@/components/content/Announce";
import MenuContent from "@/components/content/MenuContent";
import NewsFeed from "@/components/content/NewsFeed";
import PotalProgram from "@/components/content/PotalProgram";
import { RootState } from "@/core/store";
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
import { Appbar, Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

const home = () => {
  const router = useRouter();
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
            source={require("@/assets/images/thasala-icon.png")}
            style={{ width: 160, height: 45, marginRight: 10 }}
            resizeMode="contain"
          />
        </View>
        {/* <Appbar.Action icon="qrcode" color={theme.colors.primary} size={30} /> */}
        <Appbar.Action
          icon="bell-outline"
          color={theme.colors.primary}
          size={30}
          onPress={() => router.push("/noti")}
        />

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

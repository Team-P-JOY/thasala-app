import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomText from "@/components/CustomText";
import ImageViewer from "@/components/ImageViewer";
import { registerForPushNotifications } from "@/core/notifications";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
// import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";

const index = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [expoPushToken, setExpoPushToken] = useState<any>("");
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Get the device's system name (e.g., iOS, Android)
  //const totalMemory = DeviceInfo.getTotalMemory();

  useEffect(() => {
    // Get and Set the Push Token
    registerForPushNotifications().then((token) => setExpoPushToken(token));
  }, []);

  return (
    <CustomBackground>
      {/* <CustomTopBar title="" /> */}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.coverView}>
          <Image source={{ uri: user?.cover }} style={styles.coverImage} />
        </View>
        <View style={styles.profileContainer}>
          <ImageViewer
            imgSource={user?.avatar}
            selectedImage={require("@/assets/images/icon.png")}
            size={120}
          />
          <CustomText bold style={styles.profileName}>
            {user?.fullname_th}
          </CustomText>
          <CustomText bold style={styles.roleName}>
            {user?.position_th}
          </CustomText>
          <CustomText bold style={styles.roleName}>
            {user?.division_th}
          </CustomText>
        </View>

        <View style={{ paddingVertical: 15, alignItems: "center" }}>
          <View
            style={{
              padding: 10,
              backgroundColor: theme.colors.background,
              borderRadius: 10,
            }}
          >
            {/* {user && (
              <QRCode
                value={user?.person_id}
                size={250}
                backgroundColor={theme.colors.background}
                color={theme.colors.primary}
              />
            )} */}
          </View>
          <CustomText style={[styles.token, { color: theme.colors.onPrimary }]}>
            {expoPushToken || "ไม่มี Token"}
          </CustomText>
        </View>
      </ScrollView>
      <CustomFooterBar />
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverView: {
    width: "100%",
    height: 140,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
  },
  profileContainer: {
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
  },
  profileName: {
    paddingTop: 20,
    fontSize: 20,
    color: theme.colors.primary,
  },
  roleName: {
    color: theme.colors.primary,
  },
  token: {
    fontSize: 8,
    alignItems: "center",
    marginTop: 5,
    color: "gray",
  },
});

import CustomText from "@/components/CustomText";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const BOTTOM_APPBAR_HEIGHT = 65;

const CustomFooterBar = () => {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { user, docs } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  return (
    <Appbar
      style={[
        styles.container,
        {
          height: BOTTOM_APPBAR_HEIGHT,
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <View style={styles.bottom}>
        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/home")}
          >
            <Ionicons
              name="home-outline"
              size={32}
              style={
                pathname === "/home" ? styles.navIconActive : styles.navIcon
              }
            />

            <CustomText
              style={
                pathname === "/home" ? styles.navTextActive : styles.navText
              }
            >
              หน้าหลัก
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/news")}
          >
            <Ionicons
              name="newspaper-outline"
              size={32}
              style={
                pathname === "/news" ? styles.navIconActive : styles.navIcon
              }
            />
            <CustomText
              style={
                pathname === "/news" ? styles.navTextActive : styles.navText
              }
            >
              ข่าวสาร
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/scan")}
          >
            <Ionicons
              name="scan-sharp"
              size={32}
              style={
                pathname === "/scan" ? styles.navIconActive : styles.navIcon
              }
            />
            <CustomText
              style={
                pathname === "/scan" ? styles.navTextActive : styles.navText
              }
            >
              สแกน
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/profile")}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              style={
                pathname === "/profile" ? styles.navIconActive : styles.navIcon
              }
            />
            <CustomText
              style={
                pathname === "/profile" ? styles.navTextActive : styles.navText
              }
            >
              โปรไฟล์
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/setting")}
          >
            <Ionicons
              name="settings-outline"
              size={32}
              style={
                pathname === "/setting" ? styles.navIconActive : styles.navIcon
              }
            />
            <CustomText
              style={
                pathname === "/setting" ? styles.navTextActive : styles.navText
              }
            >
              ตั้งค่า
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Appbar>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 10,
  },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: theme.colors.primary,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 5,
    justifyContent: "center",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#ffffff",
  },
  navTextActive: {
    fontSize: 12,
    color: "#FF893A",
  },

  navIcon: {
    color: "#ffffff",
  },
  navIconActive: {
    color: "#FF893A",
  },
  scanButtonContainer: {
    alignItems: "center",
    position: "relative",
    bottom: 10,
  },
  scanButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomFooterBar;

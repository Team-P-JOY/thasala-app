import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import CustomText from "@/components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/core/theme";

const CustomFooterBar = () => {
  const router = useRouter();
  const { user, docs } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons
            name="home-outline"
            size={32}
            style={pathname === "/home" ? styles.navIconActive : styles.navIcon}
          />

          <CustomText
            style={pathname === "/home" ? styles.navTextActive : styles.navText}
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
            style={pathname === "/news" ? styles.navIconActive : styles.navIcon}
          />
          <CustomText
            style={pathname === "/news" ? styles.navTextActive : styles.navText}
          >
            ข่าวสาร
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/scan")}
        >
          <Ionicons
            name="qr-code-outline"
            size={32}
            style={pathname === "/scan" ? styles.navIconActive : styles.navIcon}
          />
          <CustomText
            style={pathname === "/scan" ? styles.navTextActive : styles.navText}
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: theme.colors.primary,
    height: 60,
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

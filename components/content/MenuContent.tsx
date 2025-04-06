import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomText from "../CustomText";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/core/theme";

const menuList: { id: number; title: string; icon: string }[] = [
  { id: 1, title: "เช็คอิน", icon: "location-outline" },
  { id: 2, title: "เวลาทำงาน", icon: "time-outline" },
  { id: 3, title: "สวัสดิการ", icon: "gift-outline" },
  { id: 4, title: "แจ้งเตือน", icon: "notifications-outline" },
  { id: 5, title: "WUH Care", icon: "heart-outline" },
  { id: 6, title: "ติดต่อเรา", icon: "chatbubbles-outline" },
  { id: 7, title: "ข่าวสาร", icon: "newspaper-outline" },
  { id: 8, title: "ประกาศ", icon: "megaphone-outline" },
  { id: 9, title: "ข้อมูลส่วนตัว", icon: "person-outline" },
  { id: 10, title: "ตั้งค่า", icon: "settings-outline" },
  { id: 11, title: "ออกจากระบบ", icon: "log-out-outline" },
  { id: 12, title: "แผนที่", icon: "map-outline" },
  { id: 13, title: "ข่าวสาร", icon: "newspaper-outline" },
  { id: 14, title: "ประกาศ", icon: "megaphone-outline" },
  { id: 15, title: "ข้อมูลส่วนตัว", icon: "person-outline" },
  { id: 16, title: "ตั้งค่า", icon: "settings-outline" },
  { id: 17, title: "ออกจากระบบ", icon: "log-out-outline" },
  { id: 18, title: "แผนที่", icon: "map-outline" },
];

const MenuContent = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
    >
      {menuList.map((item, index) => (
        <TouchableOpacity
          key={index}
          // onPress={() => navigation.navigate(item.screen)}
          style={{
            width: "30%",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Ionicons name={item.icon} size={40} color={theme.colors.primary} />
          <CustomText
            bold
            style={{ fontSize: 18, color: theme.colors.primary }}
          >
            {item.title}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuContent;

const styles = StyleSheet.create({});

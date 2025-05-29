import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  View
} from "react-native";

const mockData = {
  notifications: {
    leave: [
      { title: "คำขอลาวันที่ 10 มิ.ย.", description: "รออนุมัติ", time: "2 ชั่วโมงที่แล้ว" },
      { title: "คำขอลาวันที่ 8 มิ.ย.", description: "อนุมัติแล้ว", time: "เมื่อวานนี้" },
    ],
    payroll: [
      { title: "เงินเดือนเดือน มิ.ย.", description: "โอนเข้าบัญชีแล้ว", time: "วันนี้ 09:00" },
    ],
    it: [],
  },
  tasks: {
    leave: [
      { title: "ยืนยันวันลาพักร้อน", description: "กรุณาตอบกลับก่อน 15 มิ.ย.", time: "3 ชั่วโมงที่แล้ว" },
    ],
    payroll: [],
    it: [
      { title: "อัปเดตโปรแกรม HR", description: "ติดตั้งเวอร์ชันล่าสุด", time: "1 ชั่วโมงที่แล้ว" },
      { title: "ตอบแบบสำรวจ IT", description: "ความพึงพอใจระบบ", time: "เมื่อวานนี้" },
      { title: "รีเซ็ตรหัสผ่าน", description: "รหัสผ่านหมดอายุ", time: "2 วันก่อน" },
      { title: "ตรวจสอบสิทธิ์ VPN", description: "หมดอายุวันที่ 20 มิ.ย.", time: "3 วันก่อน" },
    ],
  },
};

export default function NotificationListScreen() {
  const { module, mode } = useLocalSearchParams();
  const items = mockData[mode as "notifications" | "tasks"]?.[module as string] || [];

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        index % 2 === 1 && styles.rowAlt,
        index === 0 && { borderTopWidth: 0 },
      ]}
    >
      <View style={styles.dotCol}>
        <View
          style={[
            styles.dot,
            { backgroundColor: index % 2 === 0 ? theme.colors.primary : "#FFD600" }
          ]}
        />
      </View>
      <View style={styles.textCol}>
        <CustomText bold style={styles.itemTitle}>{item.title}</CustomText>
        <CustomText style={styles.itemDesc}>{item.description}</CustomText>
      </View>
      <View style={styles.timeCol}>
        <Ionicons name="time-outline" size={14} color="#FF9500" style={{ marginBottom: 1 }} />
        <CustomText style={styles.itemTime}>{item.time}</CustomText>
      </View>
    </View>
  );

  return (
    <CustomBackground>
            <CustomTopBar title={mode === 'notifications' ? "แจ้งเตือน" : "สิ่งที่ต้องทำ"} />

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="cloud-outline" size={60} color="#bfc5da" style={{ marginBottom: 10 }} />
          <CustomText bold style={styles.empty}>ไม่มีรายการ </CustomText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
  </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5FA",
  },
  headerWrap: {
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: "#F3F5FA",
    alignItems: "center",
  },
  header: {
    fontSize: 21,
    fontWeight: "800",
    color: theme.colors.primary,
    textAlign: "center",
    letterSpacing: 0.15,
  },
  headerLine: {
    height: 3,
    width: 55,
    backgroundColor: theme.colors.primary,
    marginTop: 7,
    borderRadius: 2,
  },

  // List row style
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e8f0",
    backgroundColor: "#fff",
  },
  rowAlt: {
    backgroundColor: "#F8FAFF",
  },
  dotCol: {
    width: 26,
    alignItems: "center",
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    marginRight: 4,
  },
  textCol: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16.5,
    color: theme.colors.primary,
    marginBottom: 3,
    letterSpacing: 0.02,
  },
  itemDesc: {
    fontSize: 14.5,
    color: "#6a7693",
    fontWeight: "500",
  },
  timeCol: {
    minWidth: 72,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 12,
  },
  itemTime: {
    fontSize: 12.5,
    color: "#FF9500",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "right",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 120,
  },
  empty: {
    textAlign: "center",
    fontSize: 18,
    color: "#bfc5da",
  },
});

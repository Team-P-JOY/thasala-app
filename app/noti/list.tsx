import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.dot} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>รายการ{mode === "notifications" ? "แจ้งเตือน" : "สิ่งที่ต้องทำ"}</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>ไม่มีรายการ</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingTop: 60,
    paddingBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    marginTop: 6,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: "#555",
  },
  itemTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
    color: "#999",
  },
});

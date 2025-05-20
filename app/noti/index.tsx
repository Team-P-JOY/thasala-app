import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mockData = {
  notifications: [
    { id: "leave", name: "เรื่องการลา", icon: "calendar-outline", count: 2 },
    { id: "payroll", name: "เรื่องเงินเดือน", icon: "cash-outline", count: 1 },
    { id: "it", name: "ศูนย์เทคโนโลยี", icon: "laptop-outline", count: 0 },
  ],
  tasks: [
    { id: "leave", name: "เรื่องการลา", icon: "calendar-outline", count: 1 },
    { id: "payroll", name: "เรื่องเงินเดือน", icon: "cash-outline", count: 0 },
    { id: "it", name: "ศูนย์เทคโนโลยี", icon: "laptop-outline", count: 4 },
  ],
};

export default function NotificationModulesScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"notifications" | "tasks">("notifications");

  const handleModulePress = (moduleId: string) => {
    router.push({
      pathname: "/noti/list",
      params: { module: moduleId, mode },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleModulePress(item.id)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={28} color="#fff" />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        {item.count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.count}</Text>
          </View>
        ) : (
          <Text style={styles.noBadge}>ไม่มี{mode === "notifications" ? "แจ้งเตือน" : "สิ่งที่ต้องทำ"}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>

      {/* Toggle ปุ่มด้านบน */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          onPress={() => setMode("notifications")}
          style={[
            styles.modeButton,
            mode === "notifications" && styles.modeButtonActive,
          ]}
        >
          <Ionicons name="notifications-outline" size={18} />
          <Text style={styles.modeButtonText}> แจ้งเตือน</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("tasks")}
          style={[
            styles.modeButton,
            mode === "tasks" && styles.modeButtonActive,
          ]}
        >
          <Ionicons name="checkmark-done-outline" size={18} />
          <Text style={styles.modeButtonText}> สิ่งที่ต้องทำ</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockData[mode]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 60,
    paddingBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modeToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: "#FF9500",
  },
  modeButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  badge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 32,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noBadge: {
    fontSize: 12,
    color: "#999",
  },
});

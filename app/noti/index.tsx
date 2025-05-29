import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
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

const TAB_WIDTH = (Dimensions.get('window').width - 60) / 2;

export default function NotificationModulesScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"notifications" | "tasks">("notifications");
  const anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: mode === "notifications" ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  const handleModulePress = (moduleId: string) => {
    router.push({
      pathname: "/noti/list",
      params: { module: moduleId, mode },
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.row,
        index % 2 === 1 && styles.rowAlt,
        index === 0 && { borderTopWidth: 0 },
      ]}
      onPress={() => handleModulePress(item.id)}
      activeOpacity={0.75}
    >
      <View style={styles.iconCol}>
        <Ionicons name={item.icon} size={30} color={theme.colors.primary} />
      </View>
      <View style={styles.textCol}>
        <CustomText bold style={styles.title}>{item.name}</CustomText>
      </View>
      <View style={styles.countCol}>
        {item.count > 0 ? (
          <View style={styles.badge}>
            <CustomText bold style={styles.badgeText}>{item.count}</CustomText>
          </View>
        ) : (
          <CustomText style={styles.noBadge}>
            ไม่มี{mode === "notifications" ? "แจ้งเตือน" : "สิ่งที่ต้องทำ"}
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );

  // Animated slider for toggle
  const sliderTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TAB_WIDTH],
  });

  return (
      <CustomBackground>
      <CustomTopBar title="แจ้งเตือน & สิ่งที่ต้องทำ" />
      {/* Toggle Bar */}
      <View style={styles.modeToggleBar}>
        <Animated.View
          style={[
            styles.modeSlider,
            {
              transform: [{ translateX: sliderTranslate }],
            },
          ]}
        />
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.8}
          onPress={() => setMode("notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={18}
            color={mode === "notifications" ? theme.colors.primary : "#b0b0b0"}
          />
          <CustomText bold
            style={[
              styles.tabButtonText,
              mode === "notifications" && styles.tabButtonTextActive,
            ]}
          >
            แจ้งเตือน
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.8}
          onPress={() => setMode("tasks")}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={18}
            color={mode === "tasks" ? theme.colors.primary : "#b0b0b0"}
          />
          <CustomText bold
            style={[
              styles.tabButtonText,
              mode === "tasks" && styles.tabButtonTextActive,
            ]}
          >
            สิ่งที่ต้องทำ
          </CustomText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockData[mode]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 14 }}
        showsVerticalScrollIndicator={false}
      />
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4fa"},
  header: {
    fontSize: 22,
    fontWeight: "700",
    paddingTop: 48,
    paddingBottom: 14,
    textAlign: "center",
    color: theme.colors.primary,
    letterSpacing: 0.3,
  },
  modeToggleBar: {
    flexDirection: "row",
    backgroundColor: "#e7eaf6",
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 14,
    height: 44,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  modeSlider: {
    position: "absolute",
    width: TAB_WIDTH,
    height: "90%",
    backgroundColor: "#fffbe6",
    borderRadius: 20,
    top: 2,
    left: 2,
    zIndex: 0,
    shadowColor: "#FF9500",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    borderRadius: 20,
    height: "100%",
  },
  tabButtonText: {
    fontSize: 15,
    marginLeft: 5,
    color: "#b0b0b0",
  },
  tabButtonTextActive: {
    color: theme.colors.primary,
  },

  // Full row style (No card)
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e8f0",
    backgroundColor: "#fff",
  },
  rowAlt: {
    backgroundColor: "#F8FAFF",
  },
  iconCol: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 17.5,
    color: theme.colors.primary,
    letterSpacing: 0.06,
  },
  countCol: {
    minWidth: 64,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 14,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    minWidth: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  noBadge: {
    fontSize: 13,
    color: "#b0b0b0",
    fontStyle: "italic",
    marginLeft: 4,
  },
});

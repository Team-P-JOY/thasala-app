import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const TAB_WIDTH = (Dimensions.get('window').width - 60) / 2;

// Map ชื่อกลุ่มกับ icon (หรือเปลี่ยนตรงนี้)
const groupIcons = {
  "เรื่องการลา": "calendar-outline",
  "เรื่องเงินเดือน": "cash-outline",
  "ศูนย์เทคโนโลยี": "laptop-outline",
};

const PERSON_ID = "5800000005"; // หรือเปลี่ยนเป็น dynamic ได้

export default function NotificationModulesScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<1 | 2>(1); // 1 = notifications, 2 = tasks
  const anim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [notiData, setNotiData] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Animated.timing(anim, {
      toValue: mode === 1 ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [mode]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    setNotiData([]);
    try {
      const url = `http://10.250.2.9/apis/mbl/mbl-notification/${PERSON_ID}/${mode}/getnotification`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.code === 200 && Array.isArray(json.dtNotification)) {
        setNotiData(json.dtNotification);
      } else {
        setNotiData([]);
      }
    } catch (e) {
      setError("ไม่สามารถเชื่อมต่อ API ได้");
      setNotiData([]);
    }
    setLoading(false);
  };

  const handleModulePress = (moduleId: string) => {
    router.push({
      pathname: "/noti/list",
      params: { module: moduleId, mode: mode === 1 ? "notifications" : "tasks" },
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.row,
        index % 2 === 1 && styles.rowAlt,
        index === 0 && { borderTopWidth: 0 },
      ]}
      onPress={() => handleModulePress(item.notiGroup)}
      activeOpacity={0.75}
    >
      <View style={styles.iconCol}>
        <Ionicons
          name={groupIcons[item.notiGroupName] || "notifications-outline"}
          size={30}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.textCol}>
        <CustomText bold style={styles.title}>{item.notiGroupName}</CustomText>
      </View>
      <View style={styles.countCol}>
        {parseInt(item.notiNum) > 0 ? (
          <View style={styles.badge}>
            <CustomText bold style={styles.badgeText}>{item.notiNum}</CustomText>
          </View>
        ) : (
          <CustomText style={styles.noBadge}>
            ไม่มี{mode === 1 ? "แจ้งเตือน" : "สิ่งที่ต้องทำ"}
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
          onPress={() => setMode(1)}
        >
          <Ionicons
            name="notifications-outline"
            size={18}
            color={mode === 1 ? theme.colors.primary : "#b0b0b0"}
          />
          <CustomText bold
            style={[
              styles.tabButtonText,
              mode === 1 && styles.tabButtonTextActive,
            ]}
          >
            แจ้งเตือน
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.8}
          onPress={() => setMode(2)}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={18}
            color={mode === 2 ? theme.colors.primary : "#b0b0b0"}
          />
          <CustomText bold
            style={[
              styles.tabButtonText,
              mode === 2 && styles.tabButtonTextActive,
            ]}
          >
            สิ่งที่ต้องทำ
          </CustomText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ alignItems: "center", marginTop: 38 }}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <CustomText style={{ marginTop: 16, color: "#aaa" }}>
            กำลังโหลดข้อมูล...
          </CustomText>
        </View>
      ) : error ? (
        <View style={{ alignItems: "center", marginTop: 38 }}>
          <Ionicons name="cloud-offline-outline" size={50} color="#c5c5c5" />
          <CustomText style={{ marginTop: 18, color: "#b0b0b0", fontSize: 16 }}>{error}</CustomText>
        </View>
      ) : notiData.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 54 }}>
          <Ionicons name="cloud-outline" size={50} color="#bfc5da" />
          <CustomText style={{ marginTop: 12, color: "#b0b0b0", fontSize: 16 }}>
            ไม่มี{mode === 1 ? "แจ้งเตือน" : "สิ่งที่ต้องทำ"}
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={notiData}
          keyExtractor={(item) => item.notiGroup.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 14 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
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

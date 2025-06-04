import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function NotificationListScreen() {
  const router = useRouter();
  const { personid, mode, module } = useLocalSearchParams();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const url = `http://10.250.2.9/apis/mbl/mbl-notification/${personid}/${module}/${mode}/viewnotification`;
        console.log("Fetching Notification List from:", url);
        const res = await fetch(url);
        const json = await res.json();
        console.log("Notification List Data:", json);
        setData(json.dtNotification || []);
      } catch {
        setData([]);
      }
      setLoading(false);
    };
    if (personid && mode && module) fetchList();
  }, [personid, mode, module]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.row,
        index % 2 === 1 && styles.rowAlt,
        index === 0 && { borderTopWidth: 0 },
      ]}
      activeOpacity={0.85}
      onPress={() => {
        // ส่ง rowNo ไปดู detail
        router.push({
          pathname: item.link,
          params: {
            personid,
            mode,
            rowNo: item.rowNo // ใช้ rowNo ที่แต่ละแถวมี
          }
        });
      }}
    >
      <View style={styles.dotCol}>
        <Ionicons
          name="ellipse"
          size={13}
          color={theme.colors.primary}
          style={{ marginTop: 2 }}
        />
      </View>
      <View style={styles.textCol}>
        <CustomText bold style={styles.itemTitle}>{item.title}</CustomText>
        <CustomText style={styles.itemDesc}>{item.detail}</CustomText>
      </View>
      <View style={styles.timeCol}>
        <Ionicons name="time-outline" size={14} color="#FF9500" style={{ marginBottom: 1 }} />
        <CustomText style={styles.itemTime}>{item.dateCreated} {item.timeCreated}</CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <CustomBackground>
      <CustomTopBar title="รายการแจ้งเตือน" />
        <View style={{padding: 12, backgroundColor: "#f2f2f7"}}>
  
  </View>

      {loading ? (
        <View style={{ alignItems: "center", marginTop: 44 }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <CustomText style={{ marginTop: 20 }}>กำลังโหลดข้อมูล...</CustomText>
        </View>
      ) : !data || data.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Ionicons name="cloud-outline" size={60} color="#bfc5da" style={{ marginBottom: 10 }} />
          <CustomText bold style={styles.empty}>ไม่มีรายการ</CustomText>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.rowNo?.toString() || item.notiId?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e8f0",
    backgroundColor: "#fff",
  },
  rowAlt: {
    backgroundColor: "#F8FAFF",
  },
  dotCol: {
    width: 24,
    alignItems: "center",
  },
  textCol: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 2,
    letterSpacing: 0.02,
  },
  itemDesc: {
    fontSize: 14,
    color: "#6a7693",
    fontWeight: "500",
  },
  timeCol: {
    minWidth: 110,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
  },
  itemTime: {
    fontSize: 12,
    color: "#FF9500",
    fontWeight: "600",
    marginTop: 1,
    textAlign: "right",
  },
  empty: {
    textAlign: "center",
    fontSize: 17,
    color: "#bfc5da",
  },
});

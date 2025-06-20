import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Card, Divider, Surface } from "react-native-paper";
import { useSelector } from "react-redux";
import MenuTal from "./MenuTal";

const TalIndex = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState(1); // 1 = Dashboard, 2 = ตารางปฏิบัติงาน, 3 = Timestamp, 4 = บันทึกการลา
  const { user } = useSelector((state: RootState) => state.auth);
  const [fiscalYear, setFiscalYear] = useState(2568); //ปีงบประมาณ

  let curDate = new Date();
  let curMonth = curDate.getMonth() + 1;
  let curYear = curDate.getFullYear() + 543;
  let monthly = curMonth < 10 ? "0" + curMonth : curMonth;
  monthly = monthly + "-" + curYear;

  const [optionMonth, setOptionMonth] = useState([]);
  const [month, setMonth] = useState(monthly);
  const [shift, setShift] = useState([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [workTotal, setWorkTotal] = useState(0);
  const [work1, setWork1] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workList, setWorkList] = useState<any[]>([]);

  // ✅ State ควบคุมการเปิด/ปิด Menu
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ ฟังก์ชันเปิด-ปิด Menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [fiscalYear]);

  // ฟังก์ชันสำหรับเลือกไอคอนตามประเภทของข้อมูล
  const getIconForWorkItem = (id: string) => {
    switch (id) {
      case "2":
        return "time";
      case "3":
        return "exit";
      case "4":
        return "alert-circle";
      case "5":
        return "enter";
      case "6":
        return "log-out";
      case "7":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  // ฟังก์ชันสำหรับเลือกสีตามประเภทของข้อมูล
  const getColorForWorkItem = (id: string) => {
    switch (id) {
      case "2":
        return "#ff9800"; // มาสาย - สีส้ม
      case "3":
        return "#2196f3"; // ออกก่อน - สีฟ้า
      case "4":
        return "#ff5722"; // มาสาย/ออกก่อน - สีส้มแดง
      case "5":
        return "#e91e63"; // ไม่ลงเวลาเข้า - สีชมพู
      case "6":
        return "#9c27b0"; // ไม่ลงเวลาออก - สีม่วง
      case "7":
        return "#f44336"; // ขาดงาน - สีแดง
      default:
        return "#757575"; // เทา
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://apisprd.wu.ac.th/tal/tal-timework/${user.person_id}/2568/getTimeworkSummary`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.code === 200) {
        setLastUpdate(data.lastUpdate);
        let workTotal = 0; // วันทำการ
        let w1 = 0; //วันทำงาน
        let w2 = 0; //มาสาย
        let w3 = 0; //ออกก่อน
        let w4 = 0; //มาสาย/ออกก่อน
        let w5 = 0; //ไม่ลงเวลาเข้า
        let w6 = 0; //ไม่ลงเวลาออก
        let w7 = 0; //ขาดงาน

        for (var i = 0; i < data.dtTimeworkSummary.length; i++) {
          var row = data.dtTimeworkSummary[i];
          workTotal += parseInt(row.workTotal);
          w1 += parseFloat(row.w1);
          w2 += parseFloat(row.w2);
          w3 += parseFloat(row.w3);
          w4 += parseFloat(row.w4);
          w5 += parseFloat(row.w5);
          w6 += parseFloat(row.w6);
          w7 += parseFloat(row.w7);
        }

        setWorkTotal(workTotal);
        setWork1(w1);
        const newWorkList = [
          { id: "2", name: "มาสาย", value: w2 },
          { id: "3", name: "ออกก่อน", value: w3 },
          { id: "4", name: "มาสาย/ออกก่อน", value: w4 },
          { id: "5", name: "ไม่ลงเวลาเข้า", value: w5 },
          { id: "6", name: "ไม่ลงเวลาออก", value: w6 },
          { id: "7", name: "ขาดงาน", value: w7 },
        ];
        setWorkList(newWorkList);
      } else {
        setError("ไม่สามารถดึงข้อมูลได้");
      }
    } catch (e) {
      setError("ไม่สามารถเชื่อมต่อ API ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar title="เวลาทำงาน" back={() => router.push("/home")} />

      {/* Menu session */}
      <MenuTal />

      {/* Body session */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <CustomText style={styles.loadingText}>กำลังโหลดข้อมูล...</CustomText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={50} color="#f44336" />
            <CustomText style={styles.errorText}>{error}</CustomText>
          </View>
        ) : (
          <View style={styles.dashboardContainer}>
            {/* ส่วนแสดงจำนวนวันทำการและวันทำงาน */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <CustomText bold style={styles.cardTitle}>
                  สรุปการทำงาน
                </CustomText>
                <Divider style={styles.divider} />

                {/* จำนวนวันทำการ */}
                <View style={styles.statRow}>
                  <View style={styles.statLabelContainer}>
                    <Ionicons
                      name="calendar"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <CustomText bold style={styles.statLabel}>
                      จำนวนวันทำการ
                    </CustomText>
                  </View>
                  <Surface
                    style={[styles.statValueBadge, styles.workTotalBadge]}
                  >
                    <CustomText bold style={styles.statValueText}>
                      {workTotal}
                    </CustomText>
                  </Surface>
                </View>

                {/* จำนวนวันทำงาน */}
                <View style={styles.statRow}>
                  <View style={styles.statLabelContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <CustomText bold style={styles.statLabel}>
                      จำนวนวันทำงาน
                    </CustomText>
                  </View>
                  <Surface style={[styles.statValueBadge, styles.work1Badge]}>
                    <CustomText bold style={styles.statValueText}>
                      {work1}
                    </CustomText>
                  </Surface>
                </View>
              </Card.Content>
            </Card>

            {/* ส่วนแสดงสรุปการปฏิบัติงาน */}
            <Card style={styles.workSummaryCard}>
              <Card.Title
                title="สรุปการปฏิบัติงาน"
                titleStyle={styles.workSummaryTitle}
                left={(props) => (
                  <Ionicons
                    {...props}
                    name="stats-chart"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              />
              <Card.Content style={styles.workSummaryContent}>
                {workList.length > 0 ? (
                  workList.map((row, index) => (
                    <View key={index} style={styles.workListItem}>
                      <View style={styles.workItemInfo}>
                        <Ionicons
                          name={getIconForWorkItem(row.id)}
                          size={22}
                          color={getColorForWorkItem(row.id)}
                        />
                        <CustomText style={styles.workItemName}>
                          {row.name}
                        </CustomText>
                      </View>
                      <Surface
                        style={[
                          styles.workItemBadge,
                          { backgroundColor: getColorForWorkItem(row.id) },
                        ]}
                      >
                        <CustomText style={styles.workItemValue}>
                          {row.value}
                        </CustomText>
                      </Surface>
                    </View>
                  ))
                ) : (
                  <View style={styles.noDataContainer}>
                    <CustomText style={styles.noDataText}>
                      ไม่พบข้อมูลสรุปการปฏิบัติงาน
                    </CustomText>
                  </View>
                )}
              </Card.Content>
            </Card>

            <CustomText style={styles.textLastUpdate}>{lastUpdate}</CustomText>
          </View>
        )}
      </ScrollView>
    </CustomBackground>
  );
};

export default TalIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
  },
  dashboardContainer: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  divider: {
    marginBottom: 15,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 10,
  },
  statValueBadge: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 2,
  },
  workTotalBadge: {
    backgroundColor: "#FF8C00",
  },
  work1Badge: {
    backgroundColor: "#4CAF50",
  },
  statValueText: {
    color: "white",
    fontSize: 16,
  },
  workSummaryCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
  },
  workSummaryTitle: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  workSummaryContent: {
    paddingTop: 0,
  },
  workListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  workItemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  workItemName: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },
  workItemBadge: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 30,
    alignItems: "center",
  },
  workItemValue: {
    color: "white",
    fontWeight: "bold",
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
  textLastUpdate: {
    color: "#999",
    fontSize: 12,
    textAlign: "right",
    marginTop: 5,
    marginBottom: 20,
    fontStyle: "italic",
  },
});

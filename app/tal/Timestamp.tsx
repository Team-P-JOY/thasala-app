import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import MonthYearPicker from "@/components/MonthYearPicker";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { getDatetext } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, Surface } from "react-native-paper";
import { useSelector } from "react-redux";
import MenuTal from "./MenuTal";

const router = useRouter();
const Timestamp = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  let curDate = new Date();
  let curMonth = curDate.getMonth() + 1;
  let curYear = curDate.getFullYear() + 543;
  let monthly = curMonth < 10 ? "0" + curMonth : curMonth;
  monthly = monthly + "-" + curYear;

  const [optionMonth, setOptionMonth] = useState<any[]>([]);
  const [month, setMonth] = useState(monthly);
  const [timestamp, setTimestamp] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // State สำหรับควบคุมการแสดง modal เลือกเดือน
  const [monthSelectorVisible, setMonthSelectorVisible] = useState(false);

  // ฟังก์ชันสำหรับไปเดือนก่อนหน้า
  const goToPreviousMonth = () => {
    const currentIndex = optionMonth.findIndex((m) => m.value === month);
    if (currentIndex > 0) {
      const prevMonth = optionMonth[currentIndex + 1].value;
      handleSelect(prevMonth);
    }
  };

  // ฟังก์ชันสำหรับไปเดือนถัดไป
  const goToNextMonth = () => {
    const currentIndex = optionMonth.findIndex((m) => m.value === month);
    if (currentIndex < optionMonth.length + 1) {
      const nextMonth = optionMonth[currentIndex - 1].value;
      handleSelect(nextMonth);
    }
  };

  // รีเฟรชข้อมูล
  const onRefresh = () => {
    setRefreshing(true);
    fetchTimestampData().finally(() => setRefreshing(false));
  };

  // ฟังก์ชันสำหรับเรียกข้อมูลเดือน
  const initSelectMonth = () => {
    fetch(
      `https://apisprd.wu.ac.th/tal/tal-timework/${user.person_id}/getWorkmonth`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          let arr = [];
          for (var i = 0; i < data.dtMonth.length; i++) {
            var row = data.dtMonth[i];
            arr.push({
              label: row.monthName,
              value: row.monthVal,
            });
          }
          setOptionMonth(arr);
        }
      })
      .catch((error) => {
        console.error("Error fetching month data:", error);
      });
  };

  // ฟังก์ชันสำหรับเรียกข้อมูล timestamp
  const fetchTimestampData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://apisprd.wu.ac.th/tal/tal-timework/get-timestamp?personId=${user.person_id}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        // เรียงลำดับข้อมูลโดยเอาวันล่าสุดขึ้นก่อน
        const sortedData = [...data.dtTimestamp].sort((a, b) => {
          const dateA = new Date(a.dateCheckin.split("/").reverse().join("-"));
          const dateB = new Date(b.dateCheckin.split("/").reverse().join("-"));
          return dateB.getTime() - dateA.getTime();
        });
        setTimestamp(sortedData);
      }
    } catch (error) {
      console.error("Error fetching timestamp data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading == true) {
      initSelectMonth();
      fetchTimestampData();
    }
  }, [loading]);
  const handleSelect = (value: string) => {
    setLoading(true);
    setMonth(value);
  };

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar
        title="ประวัติการแสกนเข้า/ออกงาน"
        back={() => router.push("/home")}
      />
      {/* Menu session */}
      <MenuTal active="Timestamp" />
      {/* แสดงเดือนปัจจุบันพร้อมปุ่มเลือกเดือนก่อนหน้า/ถัดไป */}
      <View style={styles.monthNavigator}>
        <TouchableOpacity
          style={styles.monthNavButton}
          onPress={goToPreviousMonth}
          disabled={optionMonth.findIndex((m) => m.value === month) <= 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={
              optionMonth.findIndex((m) => m.value === month) <= 0
                ? "#C5C5C5"
                : "#007AFF"
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.currentMonthContainer}
          onPress={() => setMonthSelectorVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.monthTextContainer}>
            <CustomText bold style={styles.currentMonthText}>
              {optionMonth.find((m) => m.value === month)?.label ||
                "กรุณาเลือกเดือน"}
            </CustomText>
            <Ionicons
              name="caret-down"
              size={16}
              color={theme.colors.primary}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.monthNavButton}
          onPress={goToNextMonth}
          disabled={
            optionMonth.findIndex((m) => m.value === month) >=
            optionMonth.length - 1
          }
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={
              optionMonth.findIndex((m) => m.value === month) >=
              optionMonth.length - 1
                ? "#C5C5C5"
                : "#007AFF"
            }
          />
        </TouchableOpacity>
      </View>
      {/* Body session */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <CustomText style={styles.loadingText}>
              กำลังโหลดข้อมูล...
            </CustomText>
          </View>
        ) : timestamp.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="calendar-outline" size={50} color="#999" />
            <CustomText style={styles.noDataText}>
              ไม่พบข้อมูลการลงเวลา
            </CustomText>
          </View>
        ) : (
          <>
            {timestamp.map((row, index) => (
              <Surface key={index} style={styles.timestampItem}>
                <View style={styles.timestampHeader}>
                  <View style={styles.dateContainer}>
                    <Ionicons
                      name="calendar"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <CustomText bold style={styles.dateText}>
                      {getDatetext(row.dateCheckin, "th", "l")}
                    </CustomText>
                  </View>
                  <Chip
                    mode="flat"
                    style={[
                      styles.timeChip,
                      row.checktype === "0"
                        ? styles.timeOutChip
                        : styles.timeInChip,
                    ]}
                  >
                    <CustomText style={styles.timeChipText}>
                      {row.timeCheckin} น.
                    </CustomText>
                  </Chip>
                </View>
                <View style={styles.detailsRow}>
                  <View style={styles.locationContainer}>
                    <Ionicons
                      name={row.unitNameFin ? "finger-print" : "location"}
                      size={20}
                      color="#666"
                    />
                    <CustomText
                      style={styles.locationText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {row.unitNameFin
                        ? row.unitNameFin
                        : row.unitNameGps || "ไม่ระบุสถานที่"}
                    </CustomText>
                  </View>

                  <View style={styles.checkTypeContainer}>
                    <Ionicons
                      name={row.checktype === "0" ? "log-out" : "log-in"}
                      size={24}
                      color={row.checktype === "0" ? "#db2828" : "#32cd32"}
                    />
                    <CustomText
                      style={[
                        styles.checkTypeText,
                        row.checktype === "0"
                          ? styles.checkOutText
                          : styles.checkInText,
                      ]}
                    >
                      {row.checktype === "0" ? "ออก" : "เข้า"}
                    </CustomText>
                  </View>
                </View>
              </Surface>
            ))}
          </>
        )}
      </ScrollView>
      {/* Month/Year Picker Component */}
      <MonthYearPicker
        visible={monthSelectorVisible}
        onDismiss={() => setMonthSelectorVisible(false)}
        options={optionMonth}
        currentValue={month}
        onSelect={handleSelect}
      />
    </CustomBackground>
  );
};

// No longer needed as we're using inline Modal

export default Timestamp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
  },
  noDataContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    marginTop: 15,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  dropdownMonth: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  // Styles for month navigator
  monthNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  currentMonthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  monthTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  currentMonthText: {
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: "center",
  },
  // Styles for timestamp card
  timestampCard: {
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  cardContent: {
    padding: 0,
  },
  timestampItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    elevation: 1,
    backgroundColor: "#fff",
  },
  timestampHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
  },
  timeChip: {
    height: 34,
  },
  timeInChip: {
    backgroundColor: "rgba(50, 205, 50, 0.2)",
  },
  timeOutChip: {
    backgroundColor: "rgba(219, 40, 40, 0.2)",
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  timestampDetails: {
    marginTop: 3,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  checkInText: {
    color: "#32cd32",
  },
  checkOutText: {
    color: "#db2828",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: 8,
    maxWidth: "60%",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    textAlign: "right",
    flexShrink: 1,
  },
  itemDivider: {
    marginTop: 10,
    height: 1,
    opacity: 0.7,
  },
  listShift: {},
  title: {
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 20,
    color: theme.colors.primary,
  },
  roleName: {
    color: theme.colors.primary,
  },
  token: {
    fontSize: 8,
    alignItems: "center",
    marginTop: 5,
    color: "gray",
  },
  scrollView: {
    padding: 10,
    height: "auto",
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuChild: {
    alignItems: "center",
    width: 100,
  },
  avatarIcon: {
    backgroundColor: "#C3A7F4",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  labelDate: {
    color: "gray",
    fontSize: 14,
  },
  textStatus: {
    textAlign: "center",
    color: "gray",
  },
  textLastUpdate: {
    color: "lightgray",
    fontSize: 12,
    textAlign: "right",
    marginTop: 10,
  },
  containnerTitle: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#FF8C00",
    padding: 10,
  },
  textName: {
    fontSize: 18,
    color: "#696969",
  },
  textWorkTotal: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  textWork1: {
    color: "#000",
    fontWeight: "bold",
  },
  labelShift: {
    color: "steelblue",
    fontSize: 14,
    marginTop: 5,
  },
});

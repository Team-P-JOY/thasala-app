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
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, List } from "react-native-paper";
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
  //console.log("this month " + monthly);
  const [optionMonth, setOptionMonth] = useState<any[]>([]);
  const [month, setMonth] = useState(monthly);
  const [timestamp, setTimestamp] = useState<any[]>([]);  const [loading, setLoading] = useState(true);
  // State สำหรับควบคุมการแสดง modal เลือกเดือน
  const [monthSelectorVisible, setMonthSelectorVisible] = useState(false);

  // ฟังก์ชันสำหรับไปเดือนก่อนหน้า
  const goToPreviousMonth = () => {
    const currentIndex = optionMonth.findIndex(m => m.value === month);
    if (currentIndex > 0) {
      const prevMonth = optionMonth[currentIndex + 1].value;
      handleSelect(prevMonth);
    }
  };

  // ฟังก์ชันสำหรับไปเดือนถัดไป
  const goToNextMonth = () => {
    const currentIndex = optionMonth.findIndex(m => m.value === month);
    if (currentIndex < optionMonth.length + 1) {
      const nextMonth = optionMonth[currentIndex - 1].value;
      handleSelect(nextMonth);
    }
  };

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
      });
  };

  useEffect(() => {
    if (loading == true) {
      initSelectMonth();
      fetch(
        `https://apisprd.wu.ac.th/tal/tal-timework/get-timestamp?personId=${user.person_id}&month=${month}`,
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
            setTimestamp(data.dtTimestamp);
            setLoading(false);
          }
        });
    }
  }, [loading]);
  const handleSelect = (value: string) => {
    setLoading(true);
    setMonth(value);
  };

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar title="Timestamp" back={() => router.push("/home")} />

      {/* Menu session */}
      <MenuTal />      {/* แสดงเดือนปัจจุบันพร้อมปุ่มเลือกเดือนก่อนหน้า/ถัดไป */}
      <View style={styles.monthNavigator}>
        <TouchableOpacity 
          style={styles.monthNavButton} 
          onPress={goToPreviousMonth}
          disabled={optionMonth.findIndex(m => m.value === month) <= 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={optionMonth.findIndex(m => m.value === month) <= 0 ? "#C5C5C5" : "#007AFF"} 
          />
        </TouchableOpacity>
          <TouchableOpacity 
          style={styles.currentMonthContainer} 
          onPress={() => setMonthSelectorVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.monthTextContainer}>
            <CustomText bold style={styles.currentMonthText}>
              {optionMonth.find((m) => m.value === month)?.label || "กรุณาเลือกเดือน"}
            </CustomText>
            <Ionicons name="caret-down" size={16} color={theme.colors.primary} style={{marginLeft: 5}} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.monthNavButton} 
          onPress={goToNextMonth}
          disabled={optionMonth.findIndex(m => m.value === month) >= optionMonth.length - 1}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={optionMonth.findIndex(m => m.value === month) >= optionMonth.length - 1 ? "#C5C5C5" : "#007AFF"} 
          />
        </TouchableOpacity>
      </View>

      {/* Body session */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <List.Section>
            {timestamp.map((row, index) => (
              <View key={index}>
                <List.Item
                  title={
                    <CustomText bold style={styles.labelDate}>
                      {"วันที่ " + getDatetext(row.dateCheckin, "th", "l")}
                    </CustomText>
                  }
                  description={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Ionicons
                        name={row.unitNameFin ? "finger-print" : "map"}
                        size={22}
                        color="#FA8072"
                      />
                      <CustomText style={styles.labelShift}>
                        {row.unitNameFin ? row.unitNameFin : row.unitNameGps}
                      </CustomText>
                    </View>
                  }
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={row.checktype === "0" ? "logout" : "login"}
                      color={row.checktype === "0" ? "#db2828" : "#32cd32"}
                    />
                  )}
                  right={(props) => (
                    <CustomText style={styles.textStatus}>
                      {row.timeCheckin + " น."}
                    </CustomText>
                  )}
                  style={styles.listShift}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        )}      </ScrollView>
      
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
    // marginTop: 0,
    padding: 15,
  },
  dropdownMonth: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  // New styles for month navigator
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  currentMonthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  monthTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  currentMonthText: {
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: 'center',
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
    // alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 5,
    color: "gray",
  },
  scrollView: {
    padding: 10,
    height: "auto",
    // backgroundColor: "#000",
    // flexGrow: 1
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    //paddingHorizontal: 10,
    //backgroundColor: "#ff0000",
  },
  menuChild: {
    alignItems: "center",
    width: 100,
    //height: 100,
    // borderRightColor: "#0000ff",
    // borderRightWidth:2,
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
  },  labelShift: {
    color: "steelblue",
    fontSize: 14,
    marginTop: 5,
  },
});

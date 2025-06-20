import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import MonthYearPicker from "@/components/MonthYearPicker";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { getDatetext } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Divider, List, Modal } from "react-native-paper";
import { Float, Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { useSelector } from "react-redux";
import MenuTal from "./MenuTal";

const router = useRouter();

// กำหนดภาษาไทยสำหรับปฏิทิน
LocaleConfig.locales["th"] = {
  monthNames: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ],
  monthNamesShort: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],
  dayNames: [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ],
  dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
  today: "วันนี้",
};
LocaleConfig.defaultLocale = "th";

const statusColor = (status: Int32, leaveday: Float) => {
  let color = "white";

  if (leaveday) {
    //ลางาน
    return "yellow";
  } else {
    if (status == 0)
      //วันหยุด
      color = "white";
    else if (status == 1)
      //ปกติ
      color = "green";
    else if (status >= 2)
      //ไม่ปกติ
      color = "red";
  }
  return color;
};

const Schedule = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  let curDate = new Date();
  let curMonth = curDate.getMonth() + 1;
  let curYear = curDate.getFullYear() + 543;
  let monthly = curMonth < 10 ? "0" + curMonth : curMonth;
  monthly = monthly + "-" + curYear;
  //console.log("this month " + monthly);

  const [optionMonth, setOptionMonth] = useState<any[]>([]);
  const [month, setMonth] = useState(monthly);
  const [shift, setShift] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State เพิ่มเติมสำหรับปฏิทินและ modal รายละเอียด
  const [currentDate, setCurrentDate] = useState<string>("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDayShifts, setSelectedDayShifts] = useState<any[]>([]);

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
        //console.log(data);
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
        `https://apisprd.wu.ac.th/tal/tal-timework/get-schedule?personId=${user.person_id}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          if (data.code === 200) {
            setShift(data.dtSchedule);
            setLoading(false);
          }
        });
    }
  }, [loading]);
  const handleSelect = (value: string) => {
    setLoading(true);
    setMonth(value);
  }; // แปลงรูปแบบเดือนจาก "MM-YYYY" เป็น "YYYY-MM" สำหรับกำหนดเดือนให้ปฏิทิน
  const calendarMonth = useMemo(() => {
    if (!month) return "";

    const parts = month.split("-");
    if (parts.length !== 2) return "";

    // แปลงปีพุทธเป็นคริสตศักราช (ลบ 543)
    const monthPart = parts[0];
    const yearPart = parseInt(parts[1]) - 543;

    return `${yearPart}-${monthPart}-01`; // คืนค่าในรูปแบบ YYYY-MM-01
  }, [month]);

  // ฟังก์ชันสำหรับจัดเตรียมข้อมูลปฏิทิน
  const markedDates = useMemo(() => {
    const result: any = {};

    shift.forEach((item) => {
      const dateStr = item.startDate.split(" ")[0]; // เอาเฉพาะวันที่ ไม่เอาเวลา

      // กำหนดสีตามสถานะ
      let backgroundColor = "rgba(255, 255, 255, 0.1)";
      let textColor = "#000";

      if (parseFloat(item.leaveDay) > 0) {
        // ลางาน - สีเหลือง
        backgroundColor = "rgba(255, 255, 0, 0.2)";
      } else if (item.status == 1) {
        // ปกติ - สีเขียว
        backgroundColor = "rgba(50, 205, 50, 0.2)";
      } else if (item.status >= 2) {
        // ไม่ปกติ - สีแดง
        backgroundColor = "rgba(255, 0, 0, 0.2)";
      }

      // กำหนด marking ให้กับวันที่นั้น
      result[dateStr] = {
        selected: true,
        selectedColor: backgroundColor,
        selectedTextColor: textColor,
      };
    });
    return result;
  }, [shift, month]);

  // ฟังก์ชันจัดการเมื่อเลือกวันที่ในปฏิทิน
  const handleDayPress = (day: DateData) => {
    const selectedDate = day.dateString;
    setCurrentDate(selectedDate);

    // หาข้อมูลเวรของวันที่เลือก
    const shiftsForDay = shift.filter(
      (item) => item.startDate.split(" ")[0] === selectedDate
    );

    if (shiftsForDay.length > 0) {
      setSelectedDayShifts(shiftsForDay);
      setDetailModalVisible(true);
    }
  };

  const handleSchedule = (data: any) => {
    //console.log("Selected Schedule:", data.shiftId);
    setDetailModalVisible(false);
    router.push({
      pathname: "/tal/ScheduleDetail",
      params: {
        id: data.timeworkId,
        personId: data.personId,
        startDate: data.startDate, // ส่งค่า notiGroup เพื่อให้หน้ารายการใช้ filter ได้
        shiftId: data.shiftId,
      },
    });
  };

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar title="ตารางปฏิบัติงาน" back={() => router.push("/home")} />
      {/* Menu session */}
      <MenuTal active="Schedule" />
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
      {/* Body session - Calendar */}
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <>
            <Calendar
              style={styles.calendar}
              markedDates={markedDates}
              onDayPress={handleDayPress}
              // ตั้งค่าเดือนที่แสดงตามที่เลือกด้านบน
              current={calendarMonth}
              // ซ่อนตัวเลือกเดือนในปฏิทิน
              hideArrows={true}
              hideExtraDays={true}
              hideDayNames={false}
              showWeekNumbers={false}
              disableMonthChange={true}
              renderHeader={() => <View />}
              theme={{
                todayTextColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
                textSectionTitleColor: theme.colors.primary,
                todayBackgroundColor: "rgba(0, 122, 255, 0.1)",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
                dayTextColor: "#2d4150",
                textDayHeaderFontWeight: "bold",
                // ปิดการใช้งาน default selection เพราะเราใช้ custom marking แล้ว
                selectedDayBackgroundColor: "transparent",
              }}
              // ปิดการใช้งาน default selection
              disableAllTouchEventsForDisabledDays={true}
            />
            <View style={styles.legendContainer}>
              <CustomText
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  color: theme.colors.primary,
                  fontWeight: "bold",
                }}
              >
                คำอธิบายสัญลักษณ์
              </CustomText>
              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendBox,
                    { backgroundColor: "rgba(50, 205, 50, 0.2)" },
                  ]}
                />
                <CustomText style={styles.legendText}>ปกติ</CustomText>
                <View
                  style={[
                    styles.legendBox,
                    { backgroundColor: "rgba(255, 0, 0, 0.2)" },
                  ]}
                />
                <CustomText style={styles.legendText}>ไม่ปกติ</CustomText>
                <View
                  style={[
                    styles.legendBox,
                    { backgroundColor: "rgba(255, 255, 0, 0.2)" },
                  ]}
                />
                <CustomText style={styles.legendText}>ลางาน</CustomText>
              </View>
            </View>
          </>
        )}
      </View>
      {/* Modal แสดงรายละเอียดเวร */}
      <Modal
        visible={detailModalVisible}
        onDismiss={() => setDetailModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <CustomText bold style={styles.modalTitle}>
            ตารางปฏิบัติงาน {currentDate && getDatetext(currentDate, "th", "l")}
          </CustomText>
          <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScrollView}>
          <List.Section>
            {selectedDayShifts.map((row, index) => (
              <View key={index}>
                <List.Item
                  title={
                    <CustomText bold style={styles.labelDate}>
                      {"เวร" + (index + 1)}
                    </CustomText>
                  }
                  description={
                    <View>
                      <CustomText bold style={styles.labelShift}>
                        {row.shiftTypeName + ": " + row.shiftName}
                      </CustomText>
                      <View style={styles.containerTime}>
                        <CustomText style={styles.labelClockIn}>
                          {"เข้า: " + row.timeCheckin}
                        </CustomText>
                        <CustomText style={styles.labelClockOut}>
                          {"ออก: " + row.timeCheckout}
                        </CustomText>
                      </View>
                    </View>
                  }
                  right={(props) => (
                    <View style={styles.colStatus}>
                      {parseInt(row.status) > 0 ||
                      parseFloat(row.leaveDay) > 0 ? (
                        <View
                          style={[
                            styles.symbolStatus,
                            {
                              backgroundColor: statusColor(
                                row.status,
                                row.leaveDay
                              ),
                            },
                          ]}
                        ></View>
                      ) : (
                        <View></View>
                      )}
                      <CustomText style={styles.textStatus}>
                        {row.leaveDay ? "ลา" : row.statusNameTh}
                      </CustomText>
                    </View>
                  )}
                  style={styles.listShift}
                  onPress={() => handleSchedule(row)}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        </ScrollView>
      </Modal>
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

export default Schedule;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: "white",
    padding: 5,
  },
  legendContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  legendBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    margin: 4,
  },
  legendBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  legendText: {
    marginRight: 15,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    width: "90%",
    alignSelf: "center",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  dropdownMonth: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  // New styles for month navigator
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
  listShift: {},
  iconStatus: {
    width: 20,
    height: 20,
  },
  labelDate: {
    color: "gray",
    fontSize: 14,
  },
  containerTime: {
    flexDirection: "row",
    marginTop: 5,
  },
  labelShift: {
    color: "steelblue",
    fontSize: 14,
    marginTop: 5,
  },
  labelClockIn: {
    color: "#32cd32",
    width: 120,
    fontSize: 12,
  },
  labelClockOut: {
    color: "#db2828",
    width: 120,
    fontSize: 12,
  },
  colStatus: {
    alignItems: "center",
    justifyContent: "center",
  },
  symbolStatus: {
    borderRadius: 50,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
  },
  textStatus: {
    textAlign: "center",
    color: "gray",
    alignItems: "center",
  },
});

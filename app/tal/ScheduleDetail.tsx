import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { getDatetext } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, List } from "react-native-paper";

const router = useRouter();
const ScheduleDetail = () => {
  const { id, personId, startDate, shiftId } = useLocalSearchParams();
  const [schedule, setSchedule] = useState([]); // ตารางปฏิบัติงาน
  const [timestamp, setTimestamp] = useState([]); // ข้อมูลการลงเวลางาน
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  const getStyles = (status) => {
    return [
      styles.textStatus,
      status == 0 && styles.textStatusGray,
      status == 1 && styles.textStatusGreen,
      status >= 2 && styles.textStatusRed,
    ].filter(Boolean);
  };

  const fetchData = (personId: String, startDate: String, shiftId: String) => {
    setLoading(true);
    //if (loading == true) {
    fetch(
      `https://apisprd.wu.ac.th/tal/tal-timework/get-schedule-detail?personId=${personId}&date=${startDate}&shiftId=${shiftId}`,
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
          setSchedule(data.dtScheduleDetail[0]);
          setTimestamp(data.dtTimestamp);
          setLoading(false);
        }
      });
    //}
  };

  useEffect(() => {
    //console.log(id, personId, startDate, shiftId);
    if (id && personId && startDate && shiftId) {
      fetchData(personId, startDate, shiftId);
    }
  }, [id, personId, startDate, shiftId]);
  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar
        title="รายละเอียด"
        back={() => router.push("/tal/Schedule")}
      />

      <View style={styles.container}>
        <View>
          <CustomText bold style={styles.textDate}>
            {getDatetext(schedule.startDate, "th", "l")}
          </CustomText>
        </View>
        <View style={styles.containerTime}>
          <View style={styles.box1}>
            <CustomText style={{ color: theme.colors.primary }}>
              {getDatetext(schedule.dateCheckin, "th", "l")}
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Ionicons name="log-in-outline" size={50} color="#32cd32" />
              <CustomText bold style={{ color: "#808080" }}>
                {schedule.timeCheckin}
              </CustomText>
            </View>
          </View>
          <View style={styles.box2}>
            <CustomText style={{ color: theme.colors.primary }}>
              {getDatetext(schedule.dateCheckout, "th", "l")}
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Ionicons name="log-out-outline" size={50} color="#db2828" />
              <CustomText bold style={{ color: "#808080" }}>
                {schedule.timeCheckout}
              </CustomText>
            </View>
          </View>
        </View>
        {/* <View style={styles.textStatus}>
          <Text  variant="headlineMedium" style={{textAlign: "center", color: "green"}}>{(schedule.statusNameTh) ? schedule.statusNameTh : "-"}</Text>
        </View> */}
        <View>
          <CustomText style={getStyles(schedule.status)}>
            {schedule.statusNameTh ? schedule.statusNameTh : "-"}
          </CustomText>
        </View>
        <View style={styles.containnerTitle}>
          <Ionicons name="finger-print" size={50} color="#fff" />
          <CustomText style={{ color: "#fff", fontSize: 18 }}>
            {" "}
            สแกนนิ้ว เข้า/ออก
          </CustomText>
        </View>
        <ScrollView>
          <List.Section>
            {timestamp.map((row, index) => (
              <View key={index}>
                <List.Item
                  title={
                    <CustomText>
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
                    <CustomText
                      variant="labelSmall"
                      style={{ textAlign: "center", color: "gray" }}
                    >
                      {row.timeCheckin + " น."}
                    </CustomText>
                  )}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        </ScrollView>
      </View>
    </CustomBackground>
  );
};

export default ScheduleDetail;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    // padding: 15,
  },
  title: {
    marginBottom: 20,
  },
  textDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "steelblue",
    textAlign: "center",
    // marginTop: 20,
  },
  containerTime: {
    flexDirection: "row",
    marginTop: 20,
    // backgroundColor: "#f0f0f0",
  },
  box1: {
    width: "50%", // ขนาดกล่องแต่ละอัน
    height: 100,
    // backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 10,
  },
  box2: {
    width: "50%", // ขนาดกล่องแต่ละอัน
    height: 100,
    // backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: "#808080",
    borderLeftWidth: 2,
    // marginBottom: 10,
  },
  textStatus: {
    marginTop: 20,
    textAlign: "center",
    // color: getBackgroundColor(isDarkMode, isError),
    // backgroundColor: "#f0f0f0",
    // backgroundColor: "red",
    // color: "green",
    padding: 10,
    width: "90%",
    // fontSize: 16,
    fontWeight: "bold",
    borderRadius: 50,
    margin: "auto",
  },
  textStatusGreen: {
    color: "white",
    backgroundColor: "green",
  },
  textStatusGray: {
    color: "white",
    backgroundColor: "gray",
  },
  textStatusRed: {
    color: "white",
    backgroundColor: "red",
  },
  containnerTitle: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#FF8C00",
    padding: 10,
    alignItems: "center",
  },
  labelShift: {
    color: "steelblue",
    fontSize: 14,
    marginTop: 5,
  },
});

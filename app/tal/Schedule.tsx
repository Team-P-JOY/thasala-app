import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { getDatetext } from "@/core/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, List, Menu } from "react-native-paper";
import { Float, Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { useSelector } from "react-redux";
import MenuTal from "./MenuTal";

const router = useRouter();
const statusColor = (status: Int32, leaveday: Float) => {
  let color = "white";
  
  if(leaveday){
    //ลางาน
    return "yellow";
  }
  else{
    if(status == 0)
      //วันหยุด
      color = "white";
    else if(status == 1)
      //ปกติ
      color = "green";
    else if(status >= 2)
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
  const [shift, setShift] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ State ควบคุมการเปิด/ปิด Menu
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ ฟังก์ชันเปิด-ปิด Menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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

  const handleSelect = (value: Int32) => {
    setLoading(true);
    setMonth(value);
    closeMenu();
  };

  const handleSchedule = (data) => {
    //console.log("Selected Schedule:", data.shiftId);
    router.push({
      pathname: "/tal/ScheduleDetail",
      params: {
        id: data.timeworkId,
        personId: data.personId,
        startDate: data.startDate, // ส่งค่า notiGroup เพื่อให้หน้ารายการใช้ filter ได้
        shiftId: data.shiftId
      }
    });
  };

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar 
        title="ตารางปฏิบัติงาน" 
        back={() => router.push("/home")}
      />

      {/* Menu session */}
      <MenuTal />

      {/* ✅ เปลี่ยน Dropdown เป็น Menu */}
      <View style={styles.dropdownMonth}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Button mode="outlined" onPress={openMenu}>
              เลือกเดือน:{" "}
              {optionMonth.find((m) => m.value === month)?.label ||
                "กรุณาเลือกเดือน"}
            </Button>
          }
        >
          {optionMonth.map((item, index) => (
            <Menu.Item
              key={index}
              onPress={() => handleSelect(item.value)}
              title={item.label}
            />
          ))}
        </Menu>
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
            {shift.map((row, index) => (
              <View key={index}>
                <List.Item
                  title={
                    <CustomText bold style={styles.labelDate}>{"วันที่ " + getDatetext(row.startDate, "th", "l")}</CustomText>
                  }
                  description={
                    <View>
                      <CustomText bold style={styles.labelShift}>{row.shiftTypeName + ": " + row.shiftName}</CustomText>
                      <View style={styles.containerTime}>
                        <CustomText style={styles.labelClockIn}>{"เข้า: " + row.timeCheckin}</CustomText>
                        <CustomText style={styles.labelClockOut}>{"ออก: " + row.timeCheckout}</CustomText>
                      </View>
                    </View>
                  }
                  right={(props) => (
                    <View style={styles.colStatus}>
                      {
                        parseInt(row.status) > 0 || parseFloat(row.leaveDay) > 0 ? (
                          <View style={styles.symbolStatus} backgroundColor={statusColor(row.status, row.leaveDay)}></View>
                        ) : (
                          <View></View>
                        )
                      }
                      <CustomText style={styles.textStatus}>{row.leaveDay ? "ลา" : row.statusNameTh}</CustomText>
                    </View>
                  )}
                  style={styles.listShift}
                  onPress={() => handleSchedule(row)}
                  // onPress={() => console.log("Pressed item", row)}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        )}
      </ScrollView>
    </CustomBackground>
  )
}

export default Schedule

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
    marginTop:5,
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
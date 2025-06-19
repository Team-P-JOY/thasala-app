import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { getDatetext } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, List, Menu } from "react-native-paper";
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
  const [timestamp, setTimestamp] = useState([]);
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
        console.log(data);
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
          console.log(data);
          if (data.code === 200) {
            setTimestamp(data.dtTimestamp);
            setLoading(false);
          }
        });
    }
  }, [loading]);

  const handleSelect = (value) => {
    setLoading(true);
    setMonth(value);
    closeMenu();
  };

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar 
        title="Timestamp" 
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
            {timestamp.map((row, index) => (
              <View key={index}>
                <List.Item
                  title={
                    <CustomText bold style={styles.labelDate}>{"วันที่ " + getDatetext(row.dateCheckin, "th", "l")}</CustomText>
                  }
                  description={
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Ionicons name={row.unitNameFin ? "finger-print" : "map"} size={22} color="#FA8072" />
                      <CustomText style={styles.labelShift}>{row.unitNameFin ? row.unitNameFin : row.unitNameGps}</CustomText>
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
                    <CustomText style={styles.textStatus}>{row.timeCheckin + " น."}</CustomText>
                  )}
                  style={styles.listShift}
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

export default Timestamp

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
  menuChild:{
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
    marginTop:10
  },
  containnerTitle: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#FF8C00",
    padding: 10
  },
  textName: {
    fontSize: 18,
    color: "#696969"
  },
  textWorkTotal:{
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
    marginTop:5,
  },
});
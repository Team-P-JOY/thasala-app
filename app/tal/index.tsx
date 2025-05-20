import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSelector } from "react-redux";

const index = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };



  const menu = [
    {
      name: "Dashboard",
      desc: "สถิติบันทึกการปฏิบัติงาน",
      screen: "Home",
      icon: "chart-arc",
    },
    {
      name: "ตารางปฏิบัติงาน",
      desc: "สถานะการปฏิบัติงาน",
      screen: "Schedule",
      icon: "calendar-month",
    },
    {
      name: "Timestamp",
      desc: "สแกนนิ้ว เข้า/ออก",
      screen: "Timestamp",
      icon: "calendar-clock",
    },
    {
      name: "บันทึกการลา",
      desc: "สถิติบันทึกการลา",
      screen: "Leave",
      icon: "account-arrow-right",
    },
  ];

  let curDate = new Date();
  let curMonth = curDate.getMonth() + 1;
  let curYear = curDate.getFullYear() + 543;
  let monthly = curMonth < 10 ? "0" + curMonth : curMonth;
  monthly = monthly + "-" + curYear;
  console.log("this month " + monthly);

  const [optionMonth, setOptionMonth] = useState([]);
  const [month, setMonth] = useState(monthly);
  const [shift, setShift] = useState([]);
  const [loading, setLoading] = useState(true);

   // ✅ State ควบคุมการเปิด/ปิด Menu
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ ฟังก์ชันเปิด-ปิด Menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);


  useEffect(() => {
    if (loading == true) {
      // initSelectMonth();
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
          console.log(data);
          if (data.code === 200) {
            setShift(data.dtSchedule);
            setLoading(false);
          }
        });
    }
  }, [loading]);
  
  return (
    <CustomBackground>
      <CustomTopBar title="เวลาทำงาน" />
      <ScrollView
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.menuContainer}>
          {menu.map((m, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                console.log("Go to", m.screen)
              }
            >
              <View style={styles.menuChild}>
                <Avatar.Icon size={80} icon={m.icon} style={styles.avatarIcon} />
                <Text variant="bodySmall" style={styles.textName}>{m.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>


      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
      </ScrollView>
      <CustomFooterBar />
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
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
  textName:{
    marginTop: 5
  },
  labelDate: {
    color: "gray",
    fontSize: 14,
  },
  textStatus: {
    textAlign: "center",
    color: "gray",
  },
});

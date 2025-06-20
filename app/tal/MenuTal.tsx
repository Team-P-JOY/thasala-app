import CustomText from "@/components/CustomText";
import { theme } from "@/core/theme";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Avatar } from "react-native-paper";

const MenuTal = () => {
  const router = useRouter();

  const menu = [
    {
      name: "Dashboard",
      desc: "สถิติบันทึกการปฏิบัติงาน",
      screen: "Home",
      icon: "chart-arc",
      route: "/tal",
    },
    {
      name: "ตารางทำงาน",
      desc: "สถานะการปฏิบัติงาน",
      screen: "Schedule",
      icon: "calendar-month",
      route: "/tal/Schedule",
    },
    {
      name: "Timestamp",
      desc: "สแกนนิ้ว เข้า/ออก",
      screen: "Timestamp",
      icon: "calendar-clock",
      route: "/tal/Timestamp",
    },
    
    // {
    //   name: "บันทึกการลา",
    //   desc: "สถิติบันทึกการลา",
    //   screen: "Leave",
    //   icon: "account-arrow-right",
    //   route: "/tal/Leave",
    // },
  ];

  return (
    <View>
      <ScrollView
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.menuContainer}>
          {menu.map((m, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>{console.log(m.route);router.push(m.route as any);} }
            >
              <View style={styles.menuChild}>
                <Avatar.Icon size={80} icon={m.icon} style={styles.avatarIcon} />
                <CustomText
                  bold
                  style={{ fontSize: 14, color: theme.colors.primary }}
                >
                  {m.name}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MenuTal;

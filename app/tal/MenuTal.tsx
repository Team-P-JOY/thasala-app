import CustomText from "@/components/CustomText";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type MenuTalProps = { active: string };

const MenuTal = ({ active = "Home" }: MenuTalProps) => {
  const router = useRouter();
  const menu = [
    {
      name: "Dashboard",
      desc: "สถิติการทำงาน",
      screen: "Home",
      icon: "stats-chart",
      route: "/tal",
    },
    {
      name: "ตารางทำงาน",
      desc: "สถานะการปฏิบัติงาน",
      screen: "Schedule",
      icon: "calendar",
      route: "/tal/Schedule",
    },
    {
      name: "ประวัติแสกน",
      desc: "สแกนนิ้ว เข้า/ออก",
      screen: "Timestamp",
      icon: "finger-print",
      route: "/tal/Timestamp",
    },

    // {
    //   name: "บันทึกการลา",
    //   desc: "สถิติบันทึกการลา",
    //   screen: "Leave",
    //   icon: "log-out-outline",
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
          {menu.map((m, index) => {
            const isActive = m.screen === active;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  router.push(m.route as any);
                }}
              >
                <View
                  style={[styles.menuChild, isActive && styles.activeMenuChild]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      isActive && styles.activeIconContainer,
                    ]}
                  >
                    <Ionicons
                      name={m.icon as any}
                      size={32}
                      color={isActive ? theme.colors.primary : "white"}
                    />
                  </View>
                  <CustomText
                    bold
                    style={[styles.menuText, isActive && styles.activeMenuText]}
                  >
                    {m.name}
                  </CustomText>
                  <CustomText
                    style={[styles.menuDesc, isActive && styles.activeMenuDesc]}
                  >
                    {m.desc}
                  </CustomText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
    height: "auto",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingVertical: 10,
  },
  menuItem: {
    marginRight: 15,
  },
  menuChild: {
    alignItems: "center",
    width: 140,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeMenuChild: {
    backgroundColor: "#F6F0FF",
    borderColor: theme.colors.primary,
    borderWidth: 1,
    shadowColor: theme.colors.primary,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeIconContainer: {
    backgroundColor: "white",
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  menuText: {
    fontSize: 16,
    color: theme.colors.primary,
    textAlign: "center",
  },
  activeMenuText: {
    fontWeight: "700",
    color: theme.colors.second,
  },
  menuDesc: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  activeMenuDesc: {
    color: "#666",
  },
});

export default MenuTal;

import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, FAB } from "react-native-paper";
import { useSelector } from "react-redux";
import MenuTal from "./MenuTal";

const router = useRouter();

const Leave = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [leavetype, setLeavetype] = useState([]); // สถิติการลา
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  let curDate = new Date();
  let curMonth = curDate.getMonth() + 1;
  let curYear = curDate.getFullYear() + 543;
  let fiscalYear = curMonth < 10 ? curYear : curYear + 1;

  useEffect(() => {
    if (loading == true) {
      //initSelectMonth();
      fetch(
        `https://apisprd.wu.ac.th/tal/tal-leave-reg/${user.person_id}/${fiscalYear}/showLeavecumulative`,
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
            setLeavetype(data.dtLeavecumulative);
            setLoading(false);
          }
        });
    }
  }, [loading]);

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar
        title={`บันทึกการลาปีงบประมาณ ${fiscalYear}`}
        back={() => router.push("/home")}
      />

      {/* Menu session */}
      <MenuTal active="Leave" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.menuContainer}>
          {leavetype.map((m, index) => (
            <Card
              key={index}
              style={{
                marginRight: 10,
                width: 230,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Card.Content>
                <TouchableOpacity key={index}>
                  <CustomText
                    bold
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ color: "white", fontSize: 18 }}
                  >
                    {m.leaveName}
                  </CustomText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="analytics-sharp"
                      size={15}
                      color={"#cedd7a"}
                      style={{ marginRight: 2, marginTop: 10 }}
                    />
                    <CustomText style={styles.textUseday}>
                      ใช้ไป {m.useday} วัน | {m.qty} ครั้ง
                    </CustomText>
                  </View>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* <PaperProvider>
        <Portal> */}
      <FAB.Group
        open={open}
        visible
        icon={open ? "close" : "plus"}
        actions={[
          {
            icon: "shape-square-rounded-plus",
            label: "สร้างใบลา",
            onPress: () => router.push("/tal/LeaveForm"),
          },
          {
            icon: "calendar-today",
            label: "ปีงบประมาณ",
            onPress: () => console.log("Pressed email"),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
      {/* </Portal>
      </PaperProvider> */}
    </CustomBackground>
  );
};

export default Leave;

const styles = StyleSheet.create({
  container: {
    // marginTop: 0,
    padding: 15,
  },
  scrollView: {
    padding: 10,
    height: "auto",
    // backgroundColor: "#000",
    // flexGrow: 1
  },
  textUseday: {
    color: "#FA8072",
    marginTop: 10,
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
  },
});

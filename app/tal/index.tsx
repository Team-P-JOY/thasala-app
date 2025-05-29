import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, List, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import MenuTal from "./MenuTal";

const router = useRouter();
const index = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [fiscalYear, setFiscalYear] = useState(2568); //ปีงบประมาณ
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // const menu = [
  //   {
  //     name: "Dashboard",
  //     desc: "สถิติบันทึกการปฏิบัติงาน",
  //     screen: "Home",
  //     icon: "chart-arc",
  //   },
  //   {
  //     name: "ตารางปฏิบัติงาน",
  //     desc: "สถานะการปฏิบัติงาน",
  //     screen: "Schedule",
  //     icon: "calendar-month",
  //   },
  //   {
  //     name: "Timestamp",
  //     desc: "สแกนนิ้ว เข้า/ออก",
  //     screen: "Timestamp",
  //     icon: "calendar-clock",
  //   },
  //   {
  //     name: "บันทึกการลา",
  //     desc: "สถิติบันทึกการลา",
  //     screen: "Leave",
  //     icon: "account-arrow-right",
  //   },
  // ];

  let curDate = new Date();
  let curMonth = curDate.getMonth() + 1;
  let curYear = curDate.getFullYear() + 543;
  let monthly = curMonth < 10 ? "0" + curMonth : curMonth;
  monthly = monthly + "-" + curYear;
  //console.log("this month " + monthly);

  const [optionMonth, setOptionMonth] = useState([]);
  const [month, setMonth] = useState(monthly);
  const [shift, setShift] = useState([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [workTotal, setWorkTotal] = useState(0);
  const [work1, setWork1] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workList, setWorkList] = useState<any[]>([]);

   // ✅ State ควบคุมการเปิด/ปิด Menu
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ ฟังก์ชันเปิด-ปิด Menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);


  // useEffect(() => {
  //   if (loading == true) {
  //     // initSelectMonth();
  //     fetch(
  //       `https://apisprd.wu.ac.th/tal/tal-timework/get-schedule?personId=${user.person_id}&month=${month}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         if (data.code === 200) {
  //           setShift(data.dtSchedule);
  //           setLoading(false);
  //         }
  //       });
  //   }
  // }, [loading]);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [fiscalYear]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    //setNotiData([]);
    try {
      fetch(
        `https://apisprd.wu.ac.th/tal/tal-timework/${user.person_id}/2568/getTimeworkSummary`,
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
          setLastUpdate(data.lastUpdate);
          let workTotal = 0; // วันทำการ
          let w1 = 0; //วันทำงาน
          let w2 = 0; //มาสาย
          let w3 = 0; //ออกก่อน
          let w4 = 0; //มาสาย/ออกก่อน
          let w5 = 0; //ไม่ลงเวลาเข้า
          let w6 = 0; //ไม่ลงเวลาออก
          let w7 = 0; //ขาดงาน
          for (var i = 0; i < data.dtTimeworkSummary.length; i++) {
            var row = data.dtTimeworkSummary[i];
            workTotal += parseInt(row.workTotal);
            w1 += parseFloat(row.w1);
            w2 += parseFloat(row.w2);
            w3 += parseFloat(row.w3);
            w4 += parseFloat(row.w4);
            w5 += parseFloat(row.w5);
            w6 += parseFloat(row.w6);
            w7 += parseFloat(row.w7);
          }
          //console.log("workTotal", workTotal);
          setWorkTotal(workTotal);
          setWork1(w1);
          const newWorkList = [
            { id: "2", name: "มาสาย", value: w2 },
            { id: "3", name: "ออกก่อน", value: w3 },
            { id: "4", name: "มาสาย/ออกก่อน", value: w4 },
            { id: "5", name: "ไม่ลงเวลาเข้า", value: w5 },
            { id: "6", name: "ไม่ลงเวลาออก", value: w6 },
            { id: "7", name: "ขาดงาน", value: w7 },
          ];
          setWorkList(newWorkList);
          setLoading(false);
        }
      });
    } 
    catch (e) {
      setError("ไม่สามารถเชื่อมต่อ API ได้");
      //setNotiData([]);
    }
    //setLoading(false);
  };
  
  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar 
        title="เวลาทำงาน" 
        back={() => router.push("/home")}
      />

      {/* Menu session */}
      <MenuTal />

      {/* Body session */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <View>
            <Card>
              <Card.Content>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <CustomText bold style={{ fontSize: 18, color: theme.colors.primary }}>จำนวนวันทำการ</CustomText>
                  <Text variant="titleLarge"  style={styles.textWorkTotal}>{workTotal}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                  <CustomText bold style={{ fontSize: 18, color: theme.colors.primary }}>จำนวนวันทำงาน</CustomText>
                  <Text variant="bodyMedium" style={styles.textWork1}>{work1}</Text>
                </View>
                
                {/* <Text variant="bodyMedium">{user && <Text>{user.person_id}</Text>}</Text> */}
              </Card.Content>
            </Card>
            <View style={styles.containnerTitle}>
              <Ionicons name="add" size={40} color={theme.colors.primary} />
              <CustomText
                bold
                style={{ fontSize: 18, color: theme.colors.primary }}
              >
                สรุปการปฏิบัติงาน
              </CustomText>
            </View>
            <List.Section>
              {workList.map((row , index) => (
                <View key={index}>
                  <List.Item
                    title={
                      <CustomText
                        bold
                        style={{ fontSize: 16, color: theme.colors.primary }}
                      >
                        {row.name}
                      </CustomText>
                    }
                    description={
                      <View>
                        <Text></Text>
                      </View>
                    }
                    right={(props) => (
                      <View style={{ textAlign: "center" }}>
                        <Avatar.Text size={50} label={row.value} />
                      </View>
                    )}
                    // style={styles.listShift}
                  />
                  <Divider />
                </View>
              ))}
            </List.Section>
            <Text style={styles.textLastUpdate}>{lastUpdate}</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Footer session */}
      <CustomFooterBar />
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    // marginTop: 0,
    padding: 15,
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
  }
});

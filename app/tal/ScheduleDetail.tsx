import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { getDatetext } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Divider, List } from "react-native-paper";

const ScheduleDetail = () => {
  const router = useRouter();
  const { id, personId, startDate, shiftId } = useLocalSearchParams();
  const [schedule, setSchedule] = useState<any>({}); // ตารางปฏิบัติงาน
  const [timestamp, setTimestamp] = useState<any[]>([]); // ข้อมูลการลงเวลางาน
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  const getStyles = (status) => {
    return [
      styles.textStatus,
      status == 0 && styles.textStatusGray,
      status == 1 && styles.textStatusGreen,
      status >= 2 && styles.textStatusRed,
    ].filter(Boolean);
  };

  const fetchData = (personId: string, startDate: string, shiftId: string) => {
    setLoading(true);
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
      })
      .catch((error) => {
        console.error("Error fetching schedule details:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id && personId && startDate && shiftId) {
      fetchData(personId as string, startDate as string, shiftId as string);
    }
  }, [id, personId, startDate, shiftId]);

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar
        title="รายละเอียดตารางงาน"
        back={() => router.push("/tal/Schedule")}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <CustomText style={styles.loadingText}>กำลังโหลดข้อมูล...</CustomText>
          </View>
        ) : (
          <>
            {/* ส่วนหัวแสดงข้อมูลวันที่และประเภทเวร */}
            <Card style={styles.headerCard}>
              <Card.Content>
                <CustomText bold style={styles.textDate}>
                  {getDatetext(schedule.startDate, "th", "l")}
                </CustomText>
                
                {schedule.shiftTypeName && schedule.shiftName && (
                  <View style={styles.shiftTypeContainer}>
                    <CustomText style={styles.shiftTypeText}>
                      {schedule.shiftTypeName}: {schedule.shiftName}
                    </CustomText>
                  </View>
                )}
                
                <View style={styles.statusContainer}>
                  <CustomText style={getStyles(schedule.status)}>
                    {schedule.statusNameTh ? schedule.statusNameTh : "-"}
                  </CustomText>
                </View>
              </Card.Content>
            </Card>

            {/* การ์ดแสดงเวลาเข้า-ออก */}
            <Card style={styles.timeCard}>
              <Card.Content style={styles.timeCardContent}>
                <View style={styles.timeBox}>
                  <View style={styles.timeHeader}>
                    <Ionicons name="log-in-outline" size={28} color="#32cd32" />
                    <CustomText style={styles.timeHeaderText}>เวลาเข้า</CustomText>
                  </View>
                  <View style={styles.timeDetails}>
                    <CustomText style={styles.timeText}>
                      {schedule.timeCheckin || "-"}
                    </CustomText>
                    <CustomText style={styles.dateText}>
                      {schedule.dateCheckin ? getDatetext(schedule.dateCheckin, "th", "short") : ""}
                    </CustomText>
                  </View>
                </View>
                
                <View style={styles.timeDivider} />
                
                <View style={styles.timeBox}>
                  <View style={styles.timeHeader}>
                    <Ionicons name="log-out-outline" size={28} color="#db2828" />
                    <CustomText style={styles.timeHeaderText}>เวลาออก</CustomText>
                  </View>
                  <View style={styles.timeDetails}>
                    <CustomText style={styles.timeText}>
                      {schedule.timeCheckout || "-"}
                    </CustomText>
                    <CustomText style={styles.dateText}>
                      {schedule.dateCheckout ? getDatetext(schedule.dateCheckout, "th", "short") : ""}
                    </CustomText>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* ส่วนแสดงรายการสแกนลายนิ้วมือ */}
            <Card style={styles.fingerprintCard}>
              <Card.Title
                title="ประวัติการลงเวลา"
                left={(props) => <Ionicons {...props} name="finger-print" size={24} color={theme.colors.primary} />}
              />
              <Card.Content>
                {timestamp.length > 0 ? (
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
                            <View style={styles.listItemDesc}>
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
                          )}                          right={(props) => (
                            <CustomText
                              style={styles.timeStampText}
                            >
                              {row.timeCheckin + " น."}
                            </CustomText>
                          )}
                        />
                        <Divider />
                      </View>
                    ))}
                  </List.Section>
                ) : (
                  <View style={styles.noDataContainer}>
                    <CustomText style={styles.noDataText}>ไม่พบข้อมูลการลงเวลา</CustomText>
                  </View>
                )}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </CustomBackground>
  );
};

export default ScheduleDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
  },
  headerCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
  },
  textDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  shiftTypeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  shiftTypeText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
  },
  textStatus: {
    textAlign: "center",
    padding: 8,
    width: "100%",
    fontWeight: "bold",
    borderRadius: 20,
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
  timeCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
  },
  timeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  timeDetails: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timeDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#ddd',
    alignSelf: 'center',
  },
  fingerprintCard: {
    borderRadius: 10,
    elevation: 4,
  },
  listItemDesc: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 5,
  },
  labelShift: {
    color: "steelblue",
    fontSize: 14,
    marginLeft: 8,
  },
  timeStampText: {
    textAlign: "center",
    color: "gray",
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  }
});

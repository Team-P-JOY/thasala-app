import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card } from "react-native-paper";
import { useSelector } from "react-redux";
import CustomText from "../CustomText";

const Activity = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;
    _callApi();
  }, [user]);

  const _callApi = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://apisprd.wu.ac.th/trn/trn-act/show-activity-dashboard?personId=" +
          user.person_id +
          "&worktypeId=4"
      );
      console.log(res.data);
      setData(res.data.dt);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={{ paddingVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
        <CustomText
          bold
          style={{
            paddingHorizontal: 10,
            fontSize: 18,
            color: theme.colors.primary,
          }}
        >
          กิจกรรมฝึกอบรม
        </CustomText>
      </View>

      {loading && (
        <View style={{ height: 150, width: "100%", padding: 10 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff80",
              borderRadius: 10,
            }}
          >
            <ActivityIndicator
              size="large"
              animating={true}
              color={theme.colors.primary}
            />
          </View>
        </View>
      )}
      {!loading &&
        data.map(
          (dt, main) =>
            dt.listByCourseGrp.length > 0 && (
              <View key={main}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ padding: 10 }}
                >
                  {dt.listByCourseGrp.map((m: any, index: number) => (
                    <Card
                      key={index}
                      mode="contained"
                      style={{
                        width: 250,
                        marginRight: 10,
                      }}
                      theme={{ colors: { surfaceVariant: "#ffffff80" } }}
                    >
                      <Card.Cover
                        source={{
                          uri:
                            "https://apisprd.wu.ac.th/trn/trn-act/download?filepath=" +
                            m.activityBannerPath,
                        }}
                        style={{ height: 150, borderRadius: 10 }}
                      />
                      <View style={{ padding: 5 }}>
                        <CustomText
                          bold
                          style={{ color: theme.colors.primary }}
                        >
                          {m.activityNameTh}
                        </CustomText>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            justifyContent: "space-between",
                          }}
                        >
                          <CustomText style={{ fontSize: 12 }}>
                            {m.activityTypeDesc}
                          </CustomText>
                          <CustomText style={{ fontSize: 12 }}>
                            {dt.coursegrpNameTh}
                          </CustomText>
                        </View>

                        <CustomText
                          style={{ fontSize: 10, color: theme.colors.second }}
                        >
                          <Ionicons
                            name="calendar"
                            size={10}
                            color={theme.colors.second}
                          />{" "}
                          {m.activityStdateTh} - {m.activityEnddateTh} |{" "}
                          {m.activityTime}
                        </CustomText>
                        <CustomText
                          style={{ fontSize: 10, color: theme.colors.second }}
                        >
                          <Ionicons
                            name="location"
                            size={10}
                            color={theme.colors.second}
                          />{" "}
                          {m.place}
                        </CustomText>
                      </View>
                    </Card>
                  ))}
                </ScrollView>
              </View>
            )
        )}
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({});

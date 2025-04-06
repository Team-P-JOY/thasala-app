import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import CustomText from "../CustomText";
import { theme } from "@/core/theme";

const PotalProgram = () => {
  const menu = [
    {
      name: "HRMS",
      desc: "ระบบสารสนเทศบริหารงานบุคคล : มหาวิทยาลัยวลัยลักษณ์",
      url: "https://hrms.wu.ac.th/",
    },
    {
      name: "WU STMS",
      desc: "ระบบสารสนเทศบริการนักศึกษา : มหาวิทยาลัยวลัยลักษณ์",
      url: "https://stms.wu.ac.th/",
    },
    {
      name: "ระบบเลือกตั้ง",
      desc: "ระบบเลือกตั้ง มหาวิทยาลัยวลัยลักษณ์",
      url: "https://vote.wu.ac.th/",
    },
    {
      name: "Sponsorship",
      desc: "สนใจพื้นที่โฆษณา หรือ สปอนเซอร์กิจกรรม",
      url: "https://event.wu.ac.th/",
    },
  ];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ padding: 10 }}
    >
      {menu.map((m, index) => (
        <Card
          key={index}
          style={{
            marginRight: 10,
            width: 250,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Card.Content>
            <TouchableOpacity key={index}>
              <CustomText bold style={{ color: "white", fontSize: 18 }}>
                {m.name}
              </CustomText>
              <CustomText style={{ color: "white" }}>{m.desc}</CustomText>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

export default PotalProgram;

const styles = StyleSheet.create({});

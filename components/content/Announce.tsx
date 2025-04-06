import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import CustomText from "@/components/CustomText";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";

const Announce = () => {
  return (
    <Card style={{ margin: 10, backgroundColor: "white" }}>
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="megaphone-outline"
            size={24}
            color={theme.colors.primary}
          />
          <CustomText
            bold
            style={{
              fontSize: 20,
              color: theme.colors.primary,
            }}
          >
            ประกาศ
          </CustomText>
        </View>
        <CustomText style={{ color: theme.colors.primary }}>
          ประกาศจาก สำนักงานอธิการบดี แจ้งเพื่อทราบ
        </CustomText>
      </Card.Content>
    </Card>
  );
};

export default Announce;

const styles = StyleSheet.create({});

import CustomText from "@/components/CustomText";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";

const Announce = () => {
  const router = useRouter();
  return (
    <Card style={{ margin: 10, backgroundColor: "white" }}>
      <Card.Content>
        <TouchableOpacity onPress={() => router.push("/announce")}>
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
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

export default Announce;

const styles = StyleSheet.create({});

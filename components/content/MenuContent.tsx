import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import CustomText from "../CustomText";

const MENU_STORAGE_KEY = "thasala@menu";

const MenuContent = () => {
  const { menu, initialMenu } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState(menu || initialMenu || []);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(MENU_STORAGE_KEY);
        if (jsonValue != null) {
          setData(JSON.parse(jsonValue));
        } else {
          // ถ้าไม่มีข้อมูลใน AsyncStorage ให้ใช้ initialMenu แทน
          setData(initialMenu || []);
        }
      } catch (e) {
        console.log("Load menu error:", e);
        // กรณีเกิดข้อผิดพลาด ให้ใช้ initialMenu เช่นกัน
        setData(initialMenu || []);
      }
    };

    loadData();
  }, [initialMenu]);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
      }}
    >
      {" "}
      {data &&
        data.map(
          (item, index) =>
            item &&
            item.show && (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route)}
                style={{
                  width: "25%",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={40}
                  color={theme.colors.primary}
                />
                <CustomText
                  bold
                  style={{ fontSize: 14, color: theme.colors.primary }}
                >
                  {item.label}
                </CustomText>
              </TouchableOpacity>
            )
        )}
      <TouchableOpacity
        onPress={() => router.push("/setting/menu")}
        style={{
          width: "25%",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            borderRadius: 50,
            backgroundColor: "#ffffff80",
          }}
        >
          <Ionicons name="add" size={40} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MenuContent;

const styles = StyleSheet.create({});

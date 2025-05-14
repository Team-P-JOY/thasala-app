import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomText from "../CustomText";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/core/theme";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MENU_STORAGE_KEY = "thasala@menu";

const MenuContent = () => {
  const { menu } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState(menu);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(MENU_STORAGE_KEY);
        if (jsonValue != null) {
          setData(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log("Load menu error:", e);
      }
    };

    loadData();
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
      }}
    >
      {data.map(
        (item, index) =>
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

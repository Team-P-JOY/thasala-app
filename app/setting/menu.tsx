import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomBackground from "@/components/CustomBackground";
import CustomTopBar from "@/components/CustomTopBar";
import CustomText from "@/components/CustomText";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { setMenu } from "@/core/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "react-native-paper";

const MENU_STORAGE_KEY = "thasala@menu";

const index = () => {
  const { menu, initialMenu } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState(menu);
  const router = useRouter();
  const dispatch = useDispatch();

  const saveMenuOrder = async (newData: any) => {
    try {
      await AsyncStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.log("Save menu error:", e);
    }
  };

  const resetMenu = async () => {
    try {
      await AsyncStorage.removeItem(MENU_STORAGE_KEY);
      setData(initialMenu);
      dispatch(setMenu(initialMenu));
    } catch (e) {
      console.log("Reset menu error:", e);
    }
  };

  const setActive = async (key: number, show: boolean) => {
    const newData = data
      .map((item: any) => {
        if (item.key === key) {
          return { ...item, show: !show };
        }
        return item;
      })
      .sort((a: any, b: any) => {
        if (!a.show && b.show) return 1;
        if (a.show && !b.show) return -1;
        if (a.show && b.show) return a.key - b.key;
        return 0;
      });
    setData(newData);
    saveMenuOrder(newData);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(MENU_STORAGE_KEY);
        if (jsonValue != null && jsonValue.length > 0) {
          setData(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log("Load menu error:", e);
      }
    };

    loadData();
  }, []);

  const renderItem = ({ item, drag, isActive }: any) => (
    <TouchableOpacity onLongPress={drag} style={[styles.menuItem]}>
      <View style={styles.itemRow}>
        <Ionicons
          name="reorder-four"
          size={32}
          color={item.show ? theme.colors.primary : "#ECDFFF"}
        />
        <Ionicons
          name={item.icon}
          size={32}
          color={item.show ? theme.colors.primary : "#ECDFFF"}
        />
        <CustomText
          bold
          style={{
            fontSize: 14,
            color: item.show ? theme.colors.primary : "#ECDFFF",
          }}
        >
          {item.label}
        </CustomText>
      </View>
      <View style={styles.itemRow}>
        <Switch
          value={item.show}
          onValueChange={() => setActive(item.key, item.show)}
          color={theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <CustomBackground>
      <CustomTopBar
        title="ตั้งค่าเมนู"
        back={() => router.push("/home")}
        right={() => resetMenu()}
        rightIcon="sync"
      />
      <View style={{ flex: 1, marginBottom: 10 }}>
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => {
            setData(data);
            saveMenuOrder(data);
          }}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          scrollEnabled={true}
          contentContainerStyle={{ gap: 10 }}
          style={{ padding: 10 }}
        />
      </View>
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff80",
    borderRadius: 12,
    justifyContent: "space-between",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

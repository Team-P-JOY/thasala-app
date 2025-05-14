import App from "@/app.json";
import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import ImageViewer from "@/components/ImageViewer";
import Modal from "@/components/Modal";
import { logout } from "@/core/authSlice";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("user", user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <CustomBackground>
      <CustomTopBar title="ตั้งค่า" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingBottom: 100 }}
      >
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <ImageViewer
              imgSource={user?.avatar}
              selectedImage={require("@/assets/images/icon.png")}
              size={90}
            />

            <View style={styles.profileText}>
              <CustomText bold style={styles.profileName}>
                {user?.fullname_th}
              </CustomText>
              <CustomText bold style={styles.roleName}>
                {user?.position_th}
              </CustomText>
              <CustomText bold style={styles.roleName}>
                {user?.division_th}
              </CustomText>
            </View>
          </View>

          <View style={{ margin: 10, gap: 10 }}>
            <TouchableOpacity
              style={styles.itemList}
              onPress={() => router.push("/setting/pinSetting")}
            >
              <View style={styles.itemRow}>
                <Ionicons
                  name="keypad"
                  size={32}
                  color={theme.colors.primary}
                />
                <CustomText
                  bold
                  style={{
                    fontSize: 14,
                    color: theme.colors.primary,
                  }}
                >
                  เปลี่ยน PIN
                </CustomText>
              </View>
              <View style={styles.itemRow}>
                <Ionicons name="chevron-forward" size={18} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemList}
              // onPress={() => router.push("/home")}
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.itemRow}>
                <Ionicons
                  name="exit-outline"
                  size={32}
                  color={theme.colors.primary}
                />
                <CustomText
                  bold
                  style={{
                    fontSize: 14,
                    color: theme.colors.primary,
                  }}
                >
                  ออกจากระบบ
                </CustomText>
              </View>
              <View style={styles.itemRow}>
                <Ionicons name="chevron-forward" size={18} />
              </View>
            </TouchableOpacity>
            <Modal
              visible={modalVisible}
              title={"ออกจากระบบ"}
              description={"คุณต้องการออกจากระบบหรือไม่?"}
              hideModal={() => {
                setModalVisible(false);
              }}
              accept={async () => {
                // await signOut();
                dispatch(logout());
                setModalVisible(false);
                router.replace("/");
              }}
              acceptText={"ตกลง"}
              cancelText={"ยกเลิก"}
            />
            <View>
              <CustomText
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "white",
                }}
              >
                Version {App.expo.version}
              </CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomFooterBar />
    </CustomBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
  },
  profileText: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  roleName: {
    color: theme.colors.primary,
  },

  itemList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff80",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

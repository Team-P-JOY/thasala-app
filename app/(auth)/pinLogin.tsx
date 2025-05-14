import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Vibration,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import { theme } from "@/core/theme";
import { Appbar, Avatar } from "react-native-paper";
import { RootState } from "@/core/store";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { setPinAuthenticated, logout } from "@/core/authSlice";
import { useRouter } from "expo-router";

const pinLogin = () => {
  const { user, pin, isPinAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [pinNum, setPinNum] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const router = useRouter();

  if (isPinAuthenticated) {
    router.replace("/home");
  }
  useEffect(() => {
    if (pinNum.length === 6) {
      if (pinNum === pin) {
        setPinAuthenticated();
        router.replace("/home");
      } else {
        setPinNum("");
        setError(true);
        Vibration.vibrate(200);
        return;
      }
    }
  }, [pinNum]);
  const handlePress = (num: string) => {
    Vibration.vibrate(80);
    if (pinNum.length < 6) {
      setPinNum(pinNum + num);
    }
    setError(false);
  };
  const handleDelete = () => {
    Vibration.vibrate(80);
    if (pinNum.length > 0) {
      setPinNum(pinNum.slice(0, -1));
    }
  };
  const handleReset = () => {
    Vibration.vibrate(80);
    setPinNum("");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  return (
    <CustomBackground style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "transparent", elevation: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 100, height: 45, marginRight: 10 }}
            resizeMode="contain"
          />
        </View>
        <Appbar.Action icon="qrcode" color={theme.colors.primary} size={30} />
        <View>
          <Avatar.Image
            size={45}
            style={styles.avatar}
            source={{ uri: user?.avatar || "https://i.pravatar.cc/150?img=3" }}
          />
        </View>
      </Appbar.Header>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 40,
            gap: 5,
          }}
        >
          <CustomText bold style={styles.title}>
            สวัสดีตอนกลางวันครับ
          </CustomText>
          <CustomText bold style={styles.title2}>
            {user?.fullname_th}
          </CustomText>
        </View>
      </View>
      <View style={styles.pinFrame}>
        <TouchableOpacity
          onPress={() => setModalLogout(true)}
          style={{
            width: "100%",
            paddingTop: 5,
            paddingHorizontal: 5,
            alignItems: "flex-end",
          }}
        >
          <Ionicons name="close" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            gap: 5,
            justifyContent: "center",
          }}
        >
          <CustomText
            bold
            style={{
              fontSize: 18,
              color: theme.colors.primary,
              textAlign: "center",
              paddingBottom: 20,
            }}
          >
            กรุณาระบุรหัส PIN 6 หลัก
          </CustomText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingVertical: 30,
            }}
          >
            <View
              style={[
                styles.pin,
                pinNum.length > 0 && { backgroundColor: theme.colors.primary },
              ]}
            ></View>
            <View
              style={[
                styles.pin,
                pinNum.length > 1 && { backgroundColor: theme.colors.primary },
              ]}
            ></View>
            <View
              style={[
                styles.pin,
                pinNum.length > 2 && { backgroundColor: theme.colors.primary },
              ]}
            ></View>
            <View
              style={[
                styles.pin,
                pinNum.length > 3 && { backgroundColor: theme.colors.primary },
              ]}
            ></View>
            <View
              style={[
                styles.pin,
                pinNum.length > 4 && { backgroundColor: theme.colors.primary },
              ]}
            ></View>
            <View
              style={[
                styles.pin,
                pinNum.length > 5 && { backgroundColor: theme.colors.primary },
              ]}
            ></View>
          </View>
          <View style={{ paddingVertical: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("1")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  1
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("2")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  2
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("3")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  3
                </CustomText>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("4")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  4
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("5")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  5
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("6")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  6
                </CustomText>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("7")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  7
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("8")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  8
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("9")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  9
                </CustomText>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity style={styles.pinButton} onPress={handleReset}>
                <Ionicons
                  name="sync"
                  size={32}
                  color={theme.colors.primary}
                  style={{ width: 60, textAlign: "center" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => handlePress("0")}
              >
                <CustomText bold style={styles.pinButtonText}>
                  0
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pinButton} onPress={handleDelete}>
                <Ionicons
                  name="backspace-outline"
                  size={32}
                  color={theme.colors.primary}
                  style={{ width: 60, textAlign: "center" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={error}
        onRequestClose={() => {
          setError(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CustomText
              bold
              style={{
                fontSize: 18,
                textAlign: "center",
                paddingTop: 10,
              }}
            >
              ไม่สามารถทำรายการได้
            </CustomText>
            <CustomText
              style={{
                textAlign: "center",
                paddingVertical: 10,
              }}
            >
              รหัส PIN ของคุณไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง
            </CustomText>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => setError(false)}
            >
              <CustomText bold style={{ color: "white", fontSize: 14 }}>
                ตกลง
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalLogout}
        onRequestClose={() => {
          setModalLogout(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CustomText
              bold
              style={{
                fontSize: 18,
                textAlign: "center",
                paddingTop: 10,
              }}
            >
              ลืมรหัส PIN?
            </CustomText>
            <CustomText
              style={{
                textAlign: "center",
                paddingVertical: 10,
              }}
            >
              คุณต้องการออกจากระบบเพื่อตั้งค่า PIN ใหม่หรือไม่?
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  width: "48%",
                  alignItems: "center",
                  marginRight: 5,
                }}
                onPress={() => setModalLogout(false)}
              >
                <CustomText
                  bold
                  style={{ color: theme.colors.primary, fontSize: 14 }}
                >
                  ยกเลิก
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  width: "48%",
                  alignItems: "center",
                  marginLeft: 5,
                }}
                onPress={handleLogout}
              >
                <CustomText bold style={{ color: "white", fontSize: 14 }}>
                  ตกลง
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CustomBackground>
  );
};

export default pinLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  avatar: {
    marginRight: 7,
  },
  pinFrame: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff80",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pin: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#ECDFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  pinButton: {
    width: "30%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 20,
  },
  pinButtonText: {
    width: 60,
    fontSize: 32,
    color: theme.colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 10,
    width: "90%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

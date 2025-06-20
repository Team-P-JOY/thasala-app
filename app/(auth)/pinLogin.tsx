import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import { logout, setPinAuthenticated } from "@/core/authSlice";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Appbar, Avatar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

const pinLogin = () => {
  const { user, pin, isPinAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [pinNum, setPinNum] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const router = useRouter();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hour = new Date().getHours();
  const dayTime =
    hour >= 6 && hour < 12 ? "ตอนเช้า" : hour >= 18 ? "ตอนกลางคืน" : "ตอนบ่าย";

  useEffect(() => {
    if (isPinAuthenticated) {
      setIsBiometricAvailable(false);
      router.replace("/home");
    }
  }, [isPinAuthenticated, router]);
  // Animation for fingerprint button
  useEffect(() => {
    if (isBiometricAvailable) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isBiometricAvailable, isPinAuthenticated]);
  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();

        if (compatible) {
          const authTypes =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
          const hasFaceID = authTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          );
          const hasFingerprint = authTypes.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT
          );

          const enrolled = await LocalAuthentication.isEnrolledAsync();
          if (!enrolled) {
            setBiometricError(
              hasFaceID
                ? "ไม่พบการลงทะเบียน Face ID"
                : hasFingerprint
                ? "ไม่พบการลงทะเบียนลายนิ้วมือ"
                : "ไม่พบการลงทะเบียน biometric"
            );
            setIsBiometricAvailable(false);
          } else {
            setIsBiometricAvailable(true);
            // ไม่เรียกใช้งาน biometric อัตโนมัติ ผู้ใช้ต้องกดปุ่มเพื่อสแกนเอง
          }
        } else {
          setIsBiometricAvailable(false);
        }
      } catch (error) {
        console.log("ไม่สามารถเช็คความพร้อมของระบบ biometric ได้:", error);
        setIsBiometricAvailable(false);
      }
    })();
  }, []);
  useEffect(() => {
    if (pinNum.length === 6) {
      if (pinNum === pin) {
        dispatch(setPinAuthenticated());
        // Navigation will happen automatically through the isPinAuthenticated effect
      } else {
        setPinNum("");
        setError(true);
        Vibration.vibrate(200);
        return;
      }
    }
  }, [pinNum, pin, dispatch]);
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
  const handleBiometricAuth = async () => {
    try {
      setBiometricError("");
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "กรุณาสแกนลายนิ้วมือ",
        cancelLabel: "ยกเลิก",
        disableDeviceFallback: true,
        fallbackLabel: "ใช้ PIN แทน",
      });
      if (result.success) {
        Vibration.vibrate(80);
        dispatch(setPinAuthenticated());
        // Navigation will happen automatically through the isPinAuthenticated effect
      } else {
        if (result.error === "user_cancel") {
          // console.log("ผู้ใช้ยกเลิกการสแกน");
        } else if (result.error === "authentication_failed") {
          setBiometricError("การยืนยันตัวตนล้มเหลว กรุณาลองอีกครั้ง");
          Vibration.vibrate(200);
        } else if (result.error === "user_fallback") {
          // User chose to use the fallback option (PIN)
          setBiometricError("");
          // Do nothing here since user will use PIN instead
        } else {
          console.log("การสแกนลายนิ้วมือล้มเหลว:", result);
          setBiometricError("ไม่สามารถยืนยันลายนิ้วมือได้");
          Vibration.vibrate(200);
        }
      }
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการสแกนลายนิ้วมือ:", error);
      setBiometricError("เกิดข้อผิดพลาดในการสแกนลายนิ้วมือ");
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      router.replace("/");
    }, 0);
  };

  return (
    <CustomBackground style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "transparent", elevation: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Image
            source={require("@/assets/images/thasala-icon.png")}
            style={{ width: 160, height: 45, marginRight: 10 }}
            resizeMode="contain"
          />
        </View>
        {/* <Appbar.Action icon="qrcode" color={theme.colors.primary} size={30} /> */}
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
            สวัสดี{dayTime}ครับ
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
            {isBiometricAvailable && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                {" "}
                <TouchableOpacity
                  onPress={handleBiometricAuth}
                  activeOpacity={0.7}
                  style={styles.fingerprintContainer}
                >
                  <Animated.View
                    style={[
                      styles.fingerprintButton,
                      {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  >
                    <Ionicons name="finger-print" size={32} color="white" />
                  </Animated.View>
                  <CustomText style={styles.fingerprintButtonText}>
                    สแกนลายนิ้วมือ
                  </CustomText>
                </TouchableOpacity>
                {biometricError && (
                  <CustomText style={styles.errorText}>
                    {biometricError}
                  </CustomText>
                )}
              </View>
            )}
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
    color: theme.colors.primary,
  },
  title2: {
    fontSize: 24,
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
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  fingerprintContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  fingerprintButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 7,
  },
  fingerprintButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  helperText: {
    color: theme.colors.primary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
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

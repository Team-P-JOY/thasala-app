import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";

const CheckInScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [checkinLogs, setCheckinLogs] = useState<any[]>([]);
  const [loadingCheckins, setLoadingCheckins] = useState<boolean>(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);
  const cameraRef = useRef<any>(null as any);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [cameraType, setCameraType] = useState<"front" | "back">("front");
  const [locations, setLocations] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [locationStatus, setLocationStatus] = useState<any>({
    status: 2,
    message: "กำลังดึงตำแหน่ง GPS...",
    distance: 0,
  });
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const submitCheckinStatus = async (
    status: number,
    photoUri: string | null = photo
  ) => {
    const formData = new FormData();
    formData.append("personId", user.person_id.toString());
    formData.append("status", status.toString());
    formData.append(
      "lat",
      location.latitude !== null
        ? location.latitude.toString().substring(0, 10)
        : "0"
    );
    formData.append(
      "lng",
      location.longitude !== null
        ? location.longitude.toString().substring(0, 10)
        : "0"
    );
    formData.append("device", Platform.OS);
    formData.append("unitId", locationStatus.unitId?.toString() ?? "1");
    formData.append("distance", locationStatus.distance.toFixed(2));
    formData.append("radius", "60");
    formData.append("remark", locationStatus.status !== 1 ? reason : "");

    // Add photo as a file if available
    if (photoUri) {
      const filename = photoUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("photo", {
        uri: photoUri,
        name: filename,
        type,
      } as any);
    } else {
      formData.append("photo", "");
    }

    formData.append("gps", "3");

    try {
      const response = await fetch(
        "https://apisprd.wu.ac.th/tal/tal-timework/timestamp",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setPhoto(null);
      if (result.code === 200) {
        // ToastAndroid.show("บันทึกสำเร็จ", ToastAndroid.SHORT);
        showModal();
        if (status === 2 || status === 92) {
          // await playSound(require("@/assets/sounds/in.m4a"));
          await playSound(
            "บันทึกเวลาเข้างานสำเร็จ เวลา " +
              currentTime.getHours() +
              " นาฬิกา " +
              currentTime.getMinutes() +
              " นาที"
          );
        } else {
          // await playSound(require("@/assets/sounds/out.m4a"));
          await playSound(
            "บันทึกเวลาออกงานสำเร็จ เวลา " +
              currentTime.getHours() +
              " นาฬิกา " +
              currentTime.getMinutes() +
              " นาที"
          );
        }
      } else {
        alert("บันทึกล้มเหลว: " + JSON.stringify(result));
      }

      _callHistory();
    } catch (error) {
      console.error("Submit Error:", error);
      alert("เกิดข้อผิดพลาดขณะส่งข้อมูล");
    }
  };

  const playSound = async (text: string) => {
    setTimeout(async () => {
      Speech.speak(text);
    }, 1000);
  };

  async function _callHistory() {
    const personId = user?.person_id;
    const dateStr = currentTime.toISOString().split("T")[0];
    setLoadingCheckins(true);
    fetch(
      `https://apisprd.wu.ac.th/tal/tal-timework/get-timestamp-today?personId=${personId}&date=${dateStr}`
    )
      .then((res) => res.json())
      .then((json) => {
        setCheckinLogs(json.dtTimestamp || []);
      })
      .catch(() => setCheckinLogs([]))
      .finally(() => setLoadingCheckins(false));
  }
  // Animation functions
  const fadeIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const animateButtonPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonScale]);

  useEffect(() => {
    if (user) {
      _callHistory();
    }
    fadeIn();
  }, [user, fadeIn]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://apisprd.wu.ac.th/tal/tal-timework/timestampPoint"
        );
        const jsonRes = await response.json();
        setLocations(jsonRes.dtTimestampPoint || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    if (locations.length === 0) {
      setLoadingLocations(true);
      fetchLocations();
    }
  }, []);

  useEffect(() => {
    if (loadingLocations) return;
    const fetchPermissionsAndLocation = async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      setHasCameraPermission(cameraStatus === "granted");
      setHasLocationPermission(locationStatus === "granted");

      if (locationStatus === "granted") {
        await _callCurrentLocation();
      }
    };

    fetchPermissionsAndLocation();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [loadingLocations]);

  const _callCurrentLocation = async () => {
    if (loadingLocations) return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    _findNearLocation(loc.coords.latitude, loc.coords.longitude);
  };

  useFocusEffect(
    useCallback(() => {
      setPhoto(null);
      _callCurrentLocation();
    }, [])
  );

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (angle: number) => (Math.PI / 180) * angle;
    const R = 6371 * 1000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const _findNearLocation = (lat: number, lng: number) => {
    if (!locations || locations.length === 0) {
      setLocationStatus({
        status: 0,
        message: "ไม่พบสถานที่",
        distance: 0,
        unitId: 0,
      });
      return;
    }

    let nearLocation: any = null;
    for (let i = 0; i < locations.length; i++) {
      const distance = haversineDistance(
        lat,
        lng,
        parseFloat(locations[i].lat),
        parseFloat(locations[i].lng)
      );
      const distanceRadius = distance - parseFloat(locations[i].radius);
      const Inarea = distance;
      const status = distanceRadius < 0;

      if (
        status ||
        nearLocation === null ||
        distanceRadius < nearLocation.distance
      ) {
        nearLocation = {
          status: status,
          message: locations[i].unitName,
          unitId: locations[i].timePointId,
          distance: distanceRadius,
          inArea: Inarea,
        };
        if (status) break;
      }
    }

    if (nearLocation) {
      setLocationStatus({
        status: nearLocation.distance < 0 ? 1 : 0,
        message:
          nearLocation.distance < 0
            ? `พื้นที่ ${nearLocation.message}`
            : `ใกล้ ${nearLocation.message}`,
        distance: Math.max(nearLocation.inArea, 0),
        unitId: nearLocation.unitId,
      });
    } else {
      setLocationStatus({
        status: 0,
        message: "ไม่ได้อยู่ในพื้นที่",
        unitId: nearLocation.unitId,
        distance: Math.max(nearLocation.distance, 0),
      });
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {
        skipProcessing: true,
      };
      const photo = await cameraRef.current.takePictureAsync(options);
      setPhoto(photo.uri);
    }
  };

  const switchCamera = () => {
    setCameraType((prevType) => (prevType === "back" ? "front" : "back"));
  };

  const takePictureAndSubmit = async (status: number, message: string) => {
    if (locationStatus.status !== 1 && !reason.trim()) {
      setReasonError(true);
      return;
    }

    try {
      // Take picture first
      if (cameraRef.current) {
        const options = {
          skipProcessing: true,
        };
        const photoResult = await cameraRef.current.takePictureAsync(options);
        setPhoto(photoResult.uri);

        // After photo is taken, then submit the status with the new photo URI
        await submitCheckinStatus(status, photoResult.uri);
        setModalText(message);
      }
    } catch (error) {
      console.error("Error taking picture and submitting:", error);
      alert("เกิดข้อผิดพลาดขณะถ่ายภาพหรือส่งข้อมูล");
    }
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="บันทึกเวลาเข้างาน"
          back={() => router.push("/home")}
        />
        <View style={styles.permissionContainer}>
          <CustomText>กำลังขอสิทธิ์...</CustomText>
        </View>
      </CustomBackground>
    );
  }

  if (loadingLocations) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="บันทึกเวลาเข้างาน"
          back={() => router.push("/home")}
        />
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="orange" />
          <CustomText>กำลังโหลดข้อมูลสถานที่...</CustomText>
        </View>
      </CustomBackground>
    );
  }

  if (!hasCameraPermission) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="บันทึกเวลาเข้างาน"
          back={() => router.push("/home")}
        />
        <View style={styles.permissionContainer}>
          <CustomText>❌ ไม่ได้รับสิทธิ์ใช้กล้อง</CustomText>
        </View>
      </CustomBackground>
    );
  }

  if (!hasLocationPermission) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="บันทึกเวลาเข้างาน"
          back={() => router.push("/home")}
        />
        <View style={styles.permissionContainer}>
          <CustomText>❌ ไม่ได้รับสิทธิ์ใช้ GPS</CustomText>
        </View>
      </CustomBackground>
    );
  }

  return (
    <CustomBackground>
      <CustomTopBar
        title="บันทึกเวลาเข้างาน"
        back={() => router.push("/home")}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <View style={{ flex: 1, padding: 5, minWidth: 0 }}>
                  <CustomText style={styles.headerText}>
                    วันที่{" "}
                    {(() => {
                      const date = currentTime;
                      const buddhistYear = date.getFullYear() + 543;
                      const month = date.toLocaleString("th-TH", {
                        month: "short",
                      });
                      const day = date.toLocaleString("th-TH", {
                        day: "2-digit",
                      });
                      return `${day} ${month} ${buddhistYear}`;
                    })()}
                  </CustomText>
                  <CustomText bold style={styles.headerText}>
                    เวลา {currentTime.toLocaleTimeString("th-TH")}
                  </CustomText>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      paddingTop: 5,
                    }}
                  >
                    {locationStatus.status === 2 && (
                      <ActivityIndicator animating={true} color="blue" />
                    )}

                    <CustomText
                      style={[
                        styles.headerStatus,
                        {
                          color:
                            locationStatus.status === 1
                              ? "#245373"
                              : locationStatus.status === 2
                              ? "#dc6803"
                              : "#dc6803",
                        },
                      ]}
                    >
                      {locationStatus.message}
                    </CustomText>
                  </View>

                  {locationStatus.distance !== 0 && (
                    <CustomText
                      style={[
                        styles.headerStatusDis,
                        {
                          color:
                            locationStatus.status === 1
                              ? "#245373"
                              : locationStatus.status === 2
                              ? "#dc6803"
                              : "#dc6803",
                        },
                      ]}
                    >
                      ( ระยะห่าง
                      {locationStatus.distance < 1000
                        ? ` ${locationStatus.distance.toFixed(2)} ม.`
                        : ` ${(locationStatus.distance / 1000).toFixed(2)} กม.`}
                      )
                    </CustomText>
                  )}

                  {locationStatus.status !== 2 && (
                    <CustomText style={[styles.headerStatus2]}>
                      {location.latitude}, {location.longitude}
                    </CustomText>
                  )}

                  <View style={{ marginTop: 10, flex: 1 }}>
                    <CustomText
                      style={{
                        color: theme.colors.primary,
                        fontSize: 12,
                      }}
                    >
                      ประวัติการเช็คอินวันนี้
                    </CustomText>
                    {loadingCheckins ? (
                      <ActivityIndicator
                        color="orange"
                        size="small"
                        style={{ marginTop: 10 }}
                      />
                    ) : checkinLogs.length === 0 ? (
                      <CustomText style={{ color: "gray", marginTop: 6 }}>
                        ยังไม่มีข้อมูลเช็คอินวันนี้
                      </CustomText>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          marginTop: 10,
                          paddingBottom: 10,
                          zIndex: 1,
                        }}
                      >
                        <View
                          style={{
                            gap: 2,
                          }}
                        >
                          {checkinLogs.map((row, idx) => (
                            <View
                              key={idx}
                              style={{
                                backgroundColor:
                                  row.checktype === "1"
                                    ? "rgba(208,237,218,0.4)"
                                    : "rgba(240,216,214,0.4)",
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 2,
                                justifyContent: "space-between",
                                gap: 5,
                              }}
                            >
                              <CustomText
                                bold
                                style={{
                                  color: row.statusName?.includes("รออนุมัติ")
                                    ? "#dc6803"
                                    : row.checktype === "1"
                                    ? "#079455"
                                    : "#d92d20",
                                  paddingLeft: 10,
                                  fontSize: 12,
                                }}
                              >
                                {row.statusName}
                              </CustomText>

                              <View
                                style={{
                                  alignItems: "flex-end",
                                  paddingRight: 10,
                                }}
                              >
                                <CustomText
                                  bold
                                  style={{
                                    color: theme.colors.primary,
                                    fontSize: 12,
                                  }}
                                >
                                  เวลา {row.timeCheckin}
                                </CustomText>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  {row.gps === "1" && (
                                    <Ionicons
                                      name="location-outline"
                                      size={10}
                                      color={theme.colors.primary}
                                      style={{ marginRight: 2 }}
                                    />
                                  )}
                                  {row.unitNameFin && (
                                    <CustomText
                                      style={{
                                        fontSize: 10,
                                        color: theme.colors.primary,
                                      }}
                                    >
                                      {row.unitNameFin}
                                    </CustomText>
                                  )}
                                  {row.unitNameGps && (
                                    <CustomText
                                      style={{
                                        fontSize: 10,
                                        color: theme.colors.primary,
                                      }}
                                    >
                                      {row.unitNameGps}
                                    </CustomText>
                                  )}
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ width: 160, padding: 5 }}>
                  <View style={styles.mapContainer}>
                    <View
                      style={[
                        styles.map,
                        { borderColor: theme.colors.primary },
                      ]}
                    >
                      {location &&
                      locations.length > 0 &&
                      locationStatus !== 2 ? (
                        <>
                          <WebView
                            originWhitelist={["*"]}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{
                              html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <style>
                  body, html { margin: 0; padding: 0; height: 100%; }
                  #map { height: 100vh; width: 100vw; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script>
                  document.addEventListener("DOMContentLoaded", function() {
                     var map = L.map('map', {
                      center: [${location.latitude}, ${location.longitude}],
                      zoom: 16,
                      zoomControl: false,
                      attributionControl: false,
                      dragging: false,
                      touchZoom: false,
                      scrollWheelZoom: false,
                      doubleClickZoom: false,
                      boxZoom: false,
                      keyboard: false
                    });
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      maxZoom: 19,
                    }).addTo(map);

                    L.marker([${location.latitude}, ${
                                location.longitude
                              }]).addTo(map).openPopup();
                    var locations = ${JSON.stringify(locations)};
                    locations.forEach(function(location) {
                      var circle = L.circle([parseFloat(location.lat), parseFloat(location.lng)], {
                            radius: parseFloat(location.radius),
                            color: '#6a11cb',
                            fillColor: '#6a11cb',
                            weight: 0.5,
                            fillOpacity: 0.2,
                            bubblingMouseEvents: false,
                            keyboard: false
                          }).addTo(map);
                      });
                    });
                </script>
              </body>
              </html>`,
                            }}
                          />
                        </>
                      ) : (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                          }}
                        >
                          <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                            style={{ marginBottom: 10 }}
                          />
                          <CustomText
                            style={{
                              textAlign: "center",
                              color: theme.colors.primary,
                            }}
                          >
                            กำลังดึงตำแหน่ง GPS...
                          </CustomText>
                          <CustomText
                            style={{
                              textAlign: "center",
                              fontSize: 12,
                              color: theme.colors.second,
                              marginTop: 5,
                            }}
                          >
                            โปรดรอสักครู่
                          </CustomText>
                        </View>
                      )}
                    </View>

                    <View style={styles.buttonsRow}>
                      <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() => {
                          animateButtonPress();
                          _callCurrentLocation();
                        }}
                      >
                        <Animated.View
                          style={{ transform: [{ scale: buttonScale }] }}
                        >
                          <Ionicons
                            name="location-outline"
                            size={28}
                            color="white"
                          />
                        </Animated.View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() => {
                          animateButtonPress();
                          switchCamera();
                        }}
                      >
                        <Animated.View
                          style={{ transform: [{ scale: buttonScale }] }}
                        >
                          <Ionicons
                            name="camera-reverse-outline"
                            size={28}
                            color="white"
                          />
                        </Animated.View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          <LinearGradient
            colors={[theme.colors.primary, "transparent"]}
            style={{ height: 90 }}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
        </View>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={{ flex: 2, position: "relative", overflow: "hidden" }}>
            <CameraView
              style={styles.camera}
              facing={cameraType}
              ref={cameraRef}
            />
            <View style={styles.cameraOverlay} pointerEvents="none">
              <View style={styles.cameraGuide}></View>
            </View>
          </View>
        </Animated.View>
      </View>
      <View style={styles.buttonBox}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            width: "100%",
            alignItems: "center",
          }}
        >
          {locationStatus.status !== 1 && (
            <View
              style={{
                marginVertical: 15,
                alignItems: "center",
                width: "100%",
              }}
            >
              <CustomText style={{ color: "red" }}>
                กรุณากรอกเหตุผลการเช็คอินนอกพื้นที่
              </CustomText>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: reasonError ? "red" : theme.colors.primary,
                  borderRadius: 8,
                  padding: 15,
                  width: "90%",
                  marginTop: 6,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
                placeholder="ใส่เหตุผลที่นี่"
                value={reason}
                onChangeText={(txt) => {
                  setReason(txt);
                  setReasonError(false);
                }}
                multiline
              />
              {reasonError && (
                <CustomText
                  style={{ color: "red", marginTop: 2, fontSize: 12 }}
                >
                  กรุณาระบุเหตุผล
                </CustomText>
              )}
            </View>
          )}
        </Animated.View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              {
                backgroundColor: "#dcfae6",
                zIndex: 99,
                opacity: locationStatus.status === 2 ? 0.6 : 1,
              },
            ]}
            onPress={() => {
              if (locationStatus.status !== 2) {
                animateButtonPress();
                takePictureAndSubmit(
                  locationStatus.status === 1 ? 2 : 92,
                  "เข้างานสำเร็จแล้ว"
                );
              } else {
                // แสดงข้อความเตือนเมื่อกำลังโหลด GPS
                setModalText("กรุณารอสักครู่\nระบบกำลังตรวจสอบตำแหน่ง GPS");
                showModal();
              }
            }}
            disabled={locationStatus.status === 2}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.iconTextRow,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <Ionicons
                name="log-in-outline"
                size={22}
                color="#079455"
                style={{ marginRight: 8 }}
              />
              <CustomText bold style={{ color: "#079455", fontSize: 16 }}>
                เข้างาน
              </CustomText>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.captureButton,
              {
                backgroundColor: "#fee4e2",
                zIndex: 99,
                opacity: locationStatus.status === 2 ? 0.6 : 1,
              },
            ]}
            onPress={() => {
              if (locationStatus.status !== 2) {
                animateButtonPress();
                takePictureAndSubmit(
                  locationStatus.status === 1 ? 3 : 93,
                  "ออกงานสำเร็จแล้ว"
                );
              } else {
                // แสดงข้อความเตือนเมื่อกำลังโหลด GPS
                setModalText("กรุณารอสักครู่\nระบบกำลังตรวจสอบตำแหน่ง GPS");
                showModal();
              }
            }}
            disabled={locationStatus.status === 2}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.iconTextRow,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#d92d20"
                style={{ marginRight: 8 }}
              />
              <CustomText bold style={{ color: "#d92d20", fontSize: 16 }}>
                ออกงาน
              </CustomText>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <Animated.View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              transform: [{ scale: buttonScale }],
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={80}
              style={{ color: theme.colors.primary, marginBottom: 15 }}
            />
            <CustomText
              bold
              style={{
                color: theme.colors.primary,
                fontSize: 22,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {modalText || "บันทึกสำเร็จ"}
            </CustomText>
            <TouchableOpacity
              onPress={() => {
                hideModal();
              }}
              style={{
                padding: 12,
                paddingHorizontal: 25,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
                marginTop: 20,
                width: "100%",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
            >
              <CustomText bold style={{ color: "white", fontSize: 16 }}>
                ตกลง
              </CustomText>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </Portal>
    </CustomBackground>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  cameraGuide: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 125,
    borderStyle: "dashed",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 0,
    zIndex: 99,
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5A9C43", // สีเข้างาน
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    minWidth: 120,
    justifyContent: "center",
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    zIndex: 1,

    flex: 1,
    height: "100%",
  },
  headerText: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  headerStatus: {
    fontSize: 15,
  },
  headerStatusDis: {
    fontSize: 15,
  },
  headerStatus2: {
    fontSize: 10,
    color: "gray",
    paddingTop: 2,
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 0,
  },
  camera: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  buttonBox: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  imageContainer: {
    alignItems: "center",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    width: 150,
  },
  map: {
    height: 200,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 5,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    zIndex: 10,
  },
  mapButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    marginLeft: 10,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CheckInScreen;

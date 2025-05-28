import CustomBackground from "@/components/CustomBackground";
import CustomTopBar from "@/components/CustomTopBar";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";

const CheckInScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null as any);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null; }>({ latitude: null, longitude: null });
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

const submitCheckinStatus = async (status: number) => {
  // ...ตรวจสอบเหมือนเดิม...

  const formData = new FormData();
  formData.append("personId", user.person_id.toString());
  formData.append("status", status.toString());
  formData.append("lat", location.latitude.toString());
  formData.append("lng", location.longitude.toString());
  formData.append("device", Platform.OS);
  formData.append("unitId", locationStatus.unitId?.toString() ?? "");
  formData.append("distance", locationStatus.distance.toString());
  formData.append("radius", "60");
  formData.append("remark", locationStatus.status !== 1 ? reason : "");

  // Log ข้อมูลที่จะส่ง
  for (let pair of formData.entries()) {
    console.log(pair[0]+ ': ' + pair[1]);
  }

  try {
    const response = await fetch("https://apisqas.wu.ac.th/tal/tal-timework/timestamp", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);
    if (result.code === 200) {
      ToastAndroid.show("บันทึกสำเร็จ", ToastAndroid.SHORT);
      setPhoto(null);
      setReason("");
      setReasonError(false);
      _callCurrentLocation();
    } else {
      alert("บันทึกล้มเหลว: " + JSON.stringify(result));
    }
  } catch (error) {
    console.error("Submit Error:", error);
    alert("เกิดข้อผิดพลาดขณะส่งข้อมูล");
  }
};

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://e-jpas.wu.ac.th/checkin/point.js"
        );
        const jsonRes = await response.json();
        setLocations(jsonRes);
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
      });
      return;
    }

    let nearLocation: any = null;
    for (let i = 0; i < locations.length; i++) {
      const distance = haversineDistance(
        lat,
        lng,
        parseFloat(locations[i].LAT),
        parseFloat(locations[i].LNG)
      );
      const distanceRadius = distance - parseFloat(locations[i].RADIUS);
      const status = distanceRadius < 0;

      if (
        status ||
        nearLocation === null ||
        distanceRadius < nearLocation.distance
      ) {
        nearLocation = {
          status: status,
          message: locations[i].UNIT_NAME,
          unitId: locations[i].UNIT_ID,
          distance: distanceRadius,
        };
        if (status) break;
      }
    }

    if (nearLocation) {
      setLocationStatus({
        status: nearLocation.distance < 0 ? 1 : 0,
        message:
          nearLocation.distance < 0
            ? `อยู่ใน ${nearLocation.message}`
            : `อยู่ใกล้ ${nearLocation.message}`,
        distance: Math.max(nearLocation.distance, 0),
        unitId: nearLocation.unitId,
      });
    } else {
      setLocationStatus({
        status: 0,
        message: "ไม่ได้อยู่ในพื้นที่",
        distance: 0,
      });
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const switchCamera = () => {
    setCameraType((prevType) => (prevType === "back" ? "front" : "back"));
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="บันทึกเวลาเข้างาน"
          back={() => router.push("/home")}
        />
        <View style={styles.permissionContainer}>
          <Text>กำลังขอสิทธิ์...</Text>
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
          <Text>กำลังโหลดข้อมูลสถานที่...</Text>
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
          <Text>❌ ไม่ได้รับสิทธิ์ใช้กล้อง</Text>
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
          <Text>❌ ไม่ได้รับสิทธิ์ใช้ GPS</Text>
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {currentTime.toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.headerText}>
              เวลา {currentTime.toLocaleTimeString("th-TH")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingTop: 15,
              }}
            >
              {locationStatus.status === 2 && (
                <ActivityIndicator animating={true} color="blue" />
              )}

              <Text
                style={[
                  styles.headerStatus,
                  {
                    color:
                      locationStatus.status === 1
                        ? "green"
                        : locationStatus.status === 2
                        ? "blue"
                        : "red",
                  },
                ]}
              >
                {locationStatus.message}
              </Text>
            </View>

            {locationStatus.distance !== 0 ? (
              <Text
                style={[
                  styles.headerStatusDis,
                  {
                    color:
                      locationStatus.status === 1
                        ? "green"
                        : locationStatus.status === 2
                        ? "blue"
                        : "red",
                  },
                ]}
              >
                (ระยะห่าง {locationStatus.distance.toFixed(2)} ม.)
              </Text>
            ) : (
              ""
            )}

            {locationStatus.status !== 2 && (
              <Text style={[styles.headerStatus2]}>
                {location.latitude}, {location.longitude}{" "}
              </Text>
            )}
          </View>
          <View style={styles.content}>
            <View style={{ flex: 2 }}>
              {!photo ? (
                <CameraView
                  style={styles.camera}
                  facing={cameraType}
                  ref={cameraRef}
                >
                  {/* ปุ่มและเหตุผลในกล่องเดียวกัน */}
                  <View style={styles.buttonBox}>
                    {locationStatus.status !== 1 && (
                      <View style={{ marginTop: 15, alignItems: "center" }}>
                        <Text style={{ color: "red", fontWeight: "bold" }}>
                          กรุณากรอกเหตุผลการเช็คอินนอกพื้นที่
                        </Text>
                        <TextInput
                          style={{
                            borderWidth: 3,
                            borderColor: reasonError ? "red" : "#ccc",
                            borderRadius: 8,
                            padding: 15,
                            width: 350,
                            marginTop: 6,
                            backgroundColor: "#fff",
                          }}
                          placeholder="ใส่เหตุผลที่นี่"
                          value={reason}
                          onChangeText={txt => {
                            setReason(txt);
                            setReasonError(false);
                          }}
                          multiline
                        />
                        {reasonError && (
                          <Text style={{ color: "red", marginTop: 2 }}>
                            กรุณาระบุเหตุผล
                          </Text>
                        )}
                      </View>
                    )}
          <View style={styles.buttonRow}>
  <TouchableOpacity
    style={styles.captureButton}
    onPress={() => {
      if (locationStatus.status !== 1 && !reason.trim()) {
        setReasonError(true);
        return;
      }
      takePicture();
      submitCheckinStatus(locationStatus.status === 1 ? 2 : 92);
    }}
    activeOpacity={0.8}
  >
    <View style={styles.iconTextRow}>
      <Ionicons name="log-in-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.buttonText}>
        {"เข้างาน"}
      </Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.captureButton, { backgroundColor: "#C25D53" }]} // สีปุ่มออกงานต่างหน่อย
    onPress={() => {
      if (locationStatus.status !== 1 && !reason.trim()) {
        setReasonError(true);
        return;
      }
      takePicture();
      submitCheckinStatus(locationStatus.status === 1 ? 3 : 93);
    }}
    activeOpacity={0.8}
  >
    <View style={styles.iconTextRow}>
      <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.buttonText}>
        {"ออกงาน"}
      </Text>
    </View>
  </TouchableOpacity>
</View>



                    
                  </View>
                </CameraView>
              ) : (
                <View style={styles.camera}>
                  <Image source={{ uri: photo }} style={styles.image} />
                </View>
              )}
            </View>
            <View style={styles.mapContainer}>
              <View style={[styles.map, { borderColor: theme.colors.primary }]}>
                {location && locations.length > 0 && locationStatus !== 2 ? (
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
                        var circle = L.circle([parseFloat(location.LAT), parseFloat(location.LNG)], {
                              radius: parseFloat(location.RADIUS),
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
                  <Text>กำลังดึงตำแหน่ง GPS...</Text>
                )}
              </View>
              {!photo ? (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={_callCurrentLocation}
                  >
                    <Ionicons name="location-outline" size={28} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={switchCamera}
                  >
                    <Ionicons
                      name="camera-reverse-outline"
                      size={28}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                ""
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </CustomBackground>
  );
};

const styles = StyleSheet.create({
buttonRow: {
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  marginBottom: 0,
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
},
buttonText: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#fff",
  textAlign: "center",
  paddingLeft: 0,
},

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    position: "absolute",
    top: 10,
    left: 10,
    width: "100%",
    zIndex: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  headerStatus: {
    fontSize: 15,
    fontWeight: "bold",
  },
  headerStatusDis: {
    fontSize: 15,
    fontWeight: "bold",
  },
  headerStatus2: {
    fontSize: 10,
    fontWeight: "bold",
    color: "gray",
    paddingTop: 2,
  },
  content: {
    flex: 1,
    position: "relative",
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
    position: "absolute",
    top: 10,
    right: 10,
    width: 150,
  },
  map: {
    height: 250,
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

import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function QrScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // รับค่า tabId จาก URL params
  const params = useLocalSearchParams();
  const [tabId, setTabId] = useState(params.tabId ? String(params.tabId) : "1");

  const [scanData, setScanData] = useState(null);

  if (!permission) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="สแกน"
          back={() => {
            router.replace("/home");
          }}
        />
        <View style={styles.container}>
          <Text style={styles.message}>Requesting camera permission...</Text>
        </View>
      </CustomBackground>
    );
  }

  if (!permission.granted) {
    return (
      <CustomBackground>
        <CustomTopBar
          title="สแกน"
          back={() => {
            router.replace("/home");
          }}
        />
        <View style={styles.container}>
          <CustomText style={styles.message}>
            เราต้องการได้รับอนุญาตจากคุณในการใช้กล้อง
          </CustomText>
          <TouchableOpacity
            style={styles.grantPermission}
            onPress={requestPermission}
          >
            <CustomText style={styles.grantPermissionText}>
              ให้สิทธิ์การเข้าถึง
            </CustomText>
          </TouchableOpacity>
        </View>
      </CustomBackground>
    );
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  function handleBarCodeScanned({ type, data }: any) {
    setScanData(data);
    setScanned(true);

    // Check if the scanned data is a URL
    const isUrl = data.match(
      /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
    );

    if (isUrl) {
      // If it's a URL, open it in the default browser
      Linking.canOpenURL(data)
        .then((supported) => {
          if (supported) {
            Linking.openURL(data);
            setScanned(false); // Reset to allow scanning again
          } else {
            console.log("Cannot open URL: " + data);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถเปิด URL นี้ได้: " + data);
            showModal();
          }
        })
        .catch((err) => {
          console.error("An error occurred", err);
          showModal();
        });
    } else {
      // If it's not a URL, show the modal
      showModal();
    }
  }

  return (
    <CustomBackground>
      <CustomTopBar
        title="สแกน"
        back={() => {
          router.replace("/home");
        }}
        right={toggleCameraFacing}
        rightIcon="camera-flip-outline"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {[
          { id: "1", name: "QR Code", icon: "qr-code-outline" as const },
          { id: "2", name: "แจ้งซ่อม", icon: "construct-outline" as const },
        ].map((tab, index) =>
          tab.id === tabId ? (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderBottomWidth: 2,
                borderColor: theme.colors.primary,
                width: "50%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 5,
              }}
              onPress={() => {
                setTabId(tab.id);
                router.setParams({ tabId: tab.id });
              }}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={theme.colors.primary}
              />
              <CustomText
                bold
                style={{
                  fontSize: 18,
                  color: theme.colors.primary,
                }}
              >
                {tab.name}
              </CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                width: "50%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 5,
              }}
              onPress={() => {
                setTabId(tab.id);
                router.setParams({ tabId: tab.id });
              }}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={theme.colors.primary}
              />
              <CustomText style={{ fontSize: 18, color: theme.colors.primary }}>
                {tab.name}
              </CustomText>
            </TouchableOpacity>
          )
        )}
      </View>
      {tabId === "1" && (
        <>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <CustomText bold style={styles.message}>
                กรุณาวาง QR Code หรือ Barcode ให้อยู่ในพื้นที่ที่กำหนด
              </CustomText>
            </View>
          </View>
          <View
            style={[
              styles.camera,
              {
                width: width * 0.9,
                height: width * 0.9,
              },
            ]}
          >
            <CameraView
              style={styles.cameraFrame}
              facing={facing}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            >
              <View style={styles.overlay}>
                <Image
                  resizeMode="contain"
                  source={require("@/assets/images/camera.png")}
                  style={{ width: width * 0.8, height: width * 0.8 }}
                />
              </View>
            </CameraView>
          </View>
        </>
      )}
      {tabId === "2" && (
        <View style={styles.comingSoonContainer}>
          <Ionicons
            name="time-outline"
            size={80}
            color={theme.colors.primary}
          />
          <CustomText
            bold
            style={{
              fontSize: 24,
              color: theme.colors.primary,
              marginTop: 20,
              textAlign: "center",
            }}
          >
            เปิดให้บริการเร็วๆนี้
          </CustomText>
          <CustomText
            style={{
              fontSize: 16,
              color: theme.colors.secondary,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            ระบบแจ้งซ่อมกำลังอยู่ในระหว่างการพัฒนา
          </CustomText>
        </View>
      )}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <Ionicons
              name="alert-circle"
              size={60}
              style={{ color: theme.colors.primary, marginBottom: 10 }}
            />
            <CustomText
              bold
              style={{
                color: theme.colors.primary,
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              {scanData}
            </CustomText>
            {/* <CustomText
              style={{
                fontSize: 14,
                color: "gray",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              กรุณาตรวจสอบ QR Code หรือ Barcode แล้วลองใหม่อีกครั้ง
            </CustomText> */}

            <TouchableOpacity
              onPress={() => {
                hideModal();
                setScanned(false);
              }}
              style={{
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: theme.colors.primary,
                borderRadius: 5,
                marginTop: 20,
                width: "100%",
                alignItems: "center",
              }}
            >
              <CustomText bold style={{ color: "white" }}>
                ตกลง
              </CustomText>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: theme.colors.primary,
    fontSize: 18,
    paddingHorizontal: 30,
  },
  camera: {
    backgroundColor: theme.colors.primary,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -((width * 0.9) / 2) },
      { translateY: -((width * 0.9) / 2) },
    ],
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  cameraFrame: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  grantPermission: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 20,
    marginTop: 20,
  },
  grantPermissionText: {
    color: "white",
    fontSize: 18,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
});

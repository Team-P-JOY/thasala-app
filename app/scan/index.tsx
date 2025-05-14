import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from "react-native";
import CustomBackground from "@/components/CustomBackground";
import CustomTopBar from "@/components/CustomTopBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import { Appbar, Modal, Portal } from "react-native-paper";
import { theme } from "@/core/theme";

const { width } = Dimensions.get("window");

export default function QrScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
    showModal();

    // router.push({
    //   pathname: "/farm/scan/[id]",
    //   params: { id: data },
    // });
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
});

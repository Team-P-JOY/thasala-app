import App from "@/app.json";
import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import { RootState } from "@/core/store";
import { useRouter } from "expo-router";
import React, { memo, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

function IntroScreen() {
  const { isAuthenticated, isLoaded, pin } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  useEffect(() => {
    if (!isLoaded) return;
    handleRedirect();
  }, [isLoaded]);

  function handleRedirect() {
    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        if (pin) {
          router.replace("/pinLogin");
        } else {
          router.replace("/pinSetting");
        }
      } else {
        router.replace("/login");
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }
  return (
    <CustomBackground style={styles.container}>
      <View>
        <Image
          resizeMode="contain"
          source={require("../assets/images/thasala-main.png")}
          style={{ height: 200 }}
        />
        {/* <CustomText bold style={styles.title}>
          Thasala
        </CustomText> */}
      </View>
      <CustomText style={styles.version}>Version {App.expo.version}</CustomText>
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
    color: "#804A9B",
    textAlign: "center",
  },
  version: {
    fontSize: 12,
    position: "absolute",
    bottom: 20,
    color: "white",
  },
});

export default memo(IntroScreen);

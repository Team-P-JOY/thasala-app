import React, { memo, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import App from "@/app.json";
import CustomBackground from "@/components/CustomBackground";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/core/store";

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
          source={require("../assets/images/slider2.png")}
          style={{ height: 100 }}
        />
        <CustomText bold style={styles.title}>
          Thasala
        </CustomText>
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

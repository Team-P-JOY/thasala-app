import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { theme } from "@/core/theme";
import { Provider as StoreProvider, useDispatch } from "react-redux";
import store from "@/core/store";
import { restoreAuth, setPin } from "@/core/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadAuth() {
      const authData = await AsyncStorage.getItem("thasala@auth");
      const pinData = await AsyncStorage.getItem("thasala@pin");
      if (authData) {
        dispatch(restoreAuth(JSON.parse(authData)));
      } else {
        dispatch(restoreAuth(null));
      }

      if (pinData) {
        dispatch(setPin(JSON.parse(pinData)));
      } else {
        dispatch(setPin(null));
      }
    }

    loadAuth();
  }, [dispatch]);

  return (
    <>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="news" options={{ headerShown: false }} />
          <Stack.Screen name="scan" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="setting" options={{ headerShown: false }} />

          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Light: require("../assets/fonts/LINESeedSansTH_A_Th.ttf"),
    Regular: require("../assets/fonts/LINESeedSansTH_A_Rg.ttf"),
    Bold: require("../assets/fonts/LINESeedSansTH_A_Bd.ttf"),
    Italic: require("../assets/fonts/LINESeedSansTH_A_Rg.ttf"),
    BoldItalic: require("../assets/fonts/LINESeedSansTH_A_Bd.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <AppContent />
    </StoreProvider>
  );
}

import { restoreAuth, setMenu, setPin } from "@/core/authSlice";
import store from "@/core/store";
import { theme } from "@/core/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider as StoreProvider, useDispatch } from "react-redux";

SplashScreen.preventAutoHideAsync();

const AUTH_STORAGE_KEY = "thasala@auth";
const MENU_STORAGE_KEY = "thasala@menu";
const PIN_STORAGE_KEY = "thasala@pin";

function AppContent() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadAuth() {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const pinData = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      const menuData = await AsyncStorage.getItem(MENU_STORAGE_KEY);

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

      if (menuData && menuData.length > 0) {
        dispatch(setMenu(JSON.parse(menuData)));
      } else {
        dispatch(setMenu([]));
      }
    }

    loadAuth();
  }, [dispatch]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.primary,
      }}
    >
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="news" options={{ headerShown: false }} />
          <Stack.Screen name="scan" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="setting" options={{ headerShown: false }} />
          <Stack.Screen name="checkin" options={{ headerShown: false }} />

          <Stack.Screen name="portal" options={{ headerShown: false }} />
          <Stack.Screen name="tal" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaView>
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

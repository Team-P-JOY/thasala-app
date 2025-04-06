import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// กำหนด State เริ่มต้น
interface AuthState {
  user: any | null;
  pin: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isPinAuthenticated: boolean;
  isLoaded: boolean;
  lang: string;
  docs: any | null;
  langs: Array<any>;
}

const initialState: AuthState = {
  user: null,
  pin: null,
  token: null,
  isAuthenticated: false,
  isPinAuthenticated: false,
  isLoaded: false,
  lang: "th",
  docs: null,
  langs: [
    { code: "th", name: "🇹🇭 ไทย" },
    { code: "en", name: "🇺🇸 English" },
    // { code: "zh", name: "🇨🇳 中文" },
    // { code: "lo", name: "🇱🇦 ລາວ" },
  ],
};

// สร้าง Slice สำหรับ Auth
const authSlice = createSlice({
  name: "thasala@auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) => {
      state.user = action.payload.user;
      state.pin = null;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isPinAuthenticated = false;
      state.isLoaded = true;
      // บันทึกข้อมูลลง AsyncStorage
      AsyncStorage.setItem("thasala@auth", JSON.stringify(action.payload));
      AsyncStorage.removeItem("thasala@pin");
    },
    logout: (state) => {
      state.user = null;
      state.pin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isPinAuthenticated = false;
      state.isLoaded = true;
      // ลบข้อมูลออกจาก AsyncStorage
      AsyncStorage.removeItem("thasala@auth");
      AsyncStorage.removeItem("thasala@pin");
    },
    setLoaded: (state) => {
      state.isLoaded = true;
    },
    restoreAuth: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string } | null>
    ) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
      state.isLoaded = true;
    },
    setLang: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
      AsyncStorage.setItem("thasala@lang", action.payload);
    },
    setDocs: (state, action: PayloadAction<any>) => {
      state.docs = action.payload;
      AsyncStorage.setItem("thasala@docs", JSON.stringify(action.payload));
    },
    setPin: (state, action: PayloadAction<any>) => {
      state.pin = action.payload;
      AsyncStorage.setItem("thasala@pin", JSON.stringify(action.payload));
    },
    setPinAuthenticated: (state) => {
      state.isPinAuthenticated = true;
    },
  },
});

// Export Actions และ Reducer
export const {
  login,
  logout,
  setLoaded,
  restoreAuth,
  setLang,
  setDocs,
  setPin,
  setPinAuthenticated,
} = authSlice.actions;
export default authSlice.reducer;

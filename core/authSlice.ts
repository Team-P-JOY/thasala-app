import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "thasala@auth";
const MENU_STORAGE_KEY = "thasala@menu";
const PIN_STORAGE_KEY = "thasala@pin";
const LANG_STORAGE_KEY = "thasala@lang";
const DOCS_STORAGE_KEY = "thasala@docs";
const INITIAL_MENU = [
  {
    key: 1,
    label: "เช็คอิน",
    icon: "location-outline",
    route: "/checkin",
    show: true,
  },
  {
    key: 2,
    label: "เวลาทำงาน",
    icon: "time-outline",
    route: "/tal",
    show: true,
  },
  {
    key: 3,
    label: "สวัสดิการ",
    icon: "gift-outline",
    route: "/portal/welfare",
    show: true,
  },
  {
    key: 4,
    label: "แจ้งเตือน",
    icon: "notifications-outline",
    route: "/noti",
    show: true,
  },
  {
    key: 5,
    label: "WUH Care",
    icon: "heart-outline",
    route: "/portal/wuh",
    show: true,
  },
  {
    key: 6,
    label: "ติดต่อเรา",
    icon: "chatbubbles-outline",
    route: "/information/contactus",
    show: true,
  },
  {
    key: 7,
    label: "ข่าวสาร",
    icon: "newspaper-outline",
    route: "/news",
    show: true,
  },
  {
    key: 8,
    label: "ประกาศ",
    icon: "megaphone-outline",
    route: "/announce",
    show: true,
  },
  {
    key: 9,
    label: "โปรไฟล์",
    icon: "person-circle-outline",
    route: "/profile",
    show: true,
  },
  {
    key: 10,
    label: "ตั้งค่า",
    icon: "settings-outline",
    route: "/setting",
    show: true,
  },
];

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
  menu: Array<any>;
  initialMenu: Array<any>;
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
  menu: INITIAL_MENU,
  initialMenu: INITIAL_MENU,
};

// สร้าง Slice สำหรับ Auth
const authSlice = createSlice({
  name: AUTH_STORAGE_KEY,
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
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
      AsyncStorage.removeItem(PIN_STORAGE_KEY);
    },
    logout: (state) => {
      state.user = null;
      state.pin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isPinAuthenticated = false;
      state.isLoaded = true;
      // ลบข้อมูลออกจาก AsyncStorage
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      AsyncStorage.removeItem(PIN_STORAGE_KEY);
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
      AsyncStorage.setItem(LANG_STORAGE_KEY, action.payload);
    },
    setDocs: (state, action: PayloadAction<any>) => {
      state.docs = action.payload;
      AsyncStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(action.payload));
    },
    setPin: (state, action: PayloadAction<any>) => {
      state.pin = action.payload;
      AsyncStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(action.payload));
    },
    setPinAuthenticated: (state) => {
      state.isPinAuthenticated = true;
    },
    setMenu: (state, action: PayloadAction<any>) => {
      state.menu = action.payload;
      AsyncStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(action.payload));
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
  setMenu,
} = authSlice.actions;
export default authSlice.reducer;

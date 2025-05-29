import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import { login } from "@/core/authSlice";
import { registerForPushNotifications } from "@/core/notifications";
import { theme } from "@/core/theme";
import { dataValidator } from "@/core/utils";
import axios from "axios";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch } from "react-redux";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({
    value: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [expoPushToken, setExpoPushToken] = useState<any>("");

  const loginApi = async (username: string, password: string) => {
    const res = await axios.post("https://hrms.wu.ac.th/index.php?r=api/auth", {
      username,
      password,
    });

    if (res.data.status === "success") {
      const expoToken = await registerForPushNotifications();
      const osname = await Device.osName;
      //console.log("Expo Push Token:", expoToken);
      const formData = new FormData();
      formData.append("personId", res.data.data.person_id);
      formData.append("expoToken", expoToken ?? "");
      formData.append("osname", osname ?? "");

      try {
        const response = await fetch(
          "http://10.250.2.9/apis/mbl/mbl-register/registerApp",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (result.code === 200) {
          //console.error("Success:");
        }
      } catch (error) {
        // console.error("Submit Error:", error);
        // alert("เกิดข้อผิดพลาดขณะส่งข้อมูล");
      }

      return res.data.data;
    } else {
      return "";
    }
  };

  const _onLoginPressed = async () => {
    const userError = dataValidator(username.value, "Username ");
    const passwordError = dataValidator(password.value, "Password ");
    if (userError || passwordError) {
      setUsername({ ...username, error: userError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    const response = await loginApi(username.value, password.value);
    console.log(response);
    if (!response) {
      setUsername({ ...username, error: "Invalid username or password" });
      setLoading(false);
    } else {
      dispatch(
        login({
          user: response,
          token: response.token,
        })
      );
      router.replace("/pinSetting");
    }
  };

  return (
    <CustomBackground style={styles.container}>
      <View>
        <Image
          resizeMode="contain"
          source={require("@/assets/images/thasala-main.png")}
          style={{ height: 200 }}
        />
      </View>
      <View style={{ width: "100%", padding: 20, gap: 5 }}>
        <CustomTextInput
          label="Username"
          returnKeyType="next"
          value={username.value}
          onChangeText={(text: string) =>
            setUsername({ value: text, error: "" })
          }
          error={!!username.error}
          errorText={username.error}
          autoCapitalize="none"
        />
        <CustomTextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text: string) =>
            setPassword({ value: text, error: "" })
          }
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <TouchableOpacity onPress={_onLoginPressed} style={styles.button}>
            <CustomText
              bold
              style={{ color: "white", fontSize: 16, padding: 2 }}
            >
              Login
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    </CustomBackground>
  );
};

export default Login;

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
    color: theme.colors.primary,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
});

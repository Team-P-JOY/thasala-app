import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomTopBar from "@/components/CustomTopBar";
import { theme } from "@/core/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const router = useRouter();
const LeaveForm = () => {
  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar 
        title="บันทึกการลา" 
        back={() => router.push("/tal/Leave")}
      />

      
      
      {/* Footer session */}
      <CustomFooterBar />
    </CustomBackground>
  )
}

export default LeaveForm

const styles = StyleSheet.create({
  container: {
    // marginTop: 0,
    padding: 15,
  },
  title: {
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
  },

  profileName: {
    fontSize: 20,
    color: theme.colors.primary,
  },
  roleName: {
    color: theme.colors.primary,
  },
  token: {
    fontSize: 8,
    // alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 5,
    color: "gray",
  },
  scrollView: {
    padding: 10, 
    height: "auto", 
    // backgroundColor: "#000",
    // flexGrow: 1
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    //paddingHorizontal: 10,
    //backgroundColor: "#ff0000",
  },
  menuChild:{
    alignItems: "center", 
    width: 100, 
    //height: 100, 
    // borderRightColor: "#0000ff",
    // borderRightWidth:2,
  },
  avatarIcon: {
    backgroundColor: "#C3A7F4",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  labelDate: {
    color: "gray",
    fontSize: 14,
  },
  textStatus: {
    textAlign: "center",
    color: "gray",
  },
  textLastUpdate: {
    color: "lightgray",
    fontSize: 12,
    textAlign: "right",
    marginTop:10
  },
  containnerTitle: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#FF8C00",
    padding: 10
  },
  textName: {
    fontSize: 18,
    color: "#696969"
  },
  textWorkTotal:{
    color: "#FF8C00",
    fontWeight: "bold",
  },
  textWork1: {
    color: "#000",
    fontWeight: "bold",
  }
});
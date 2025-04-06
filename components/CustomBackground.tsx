import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const CustomBackground = ({ children, style }: any) => {
  return (
    <LinearGradient
      colors={["#ECDFFF", "#ECDFFF", "#FFD0BC"]}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default CustomBackground;

const styles = StyleSheet.create({});

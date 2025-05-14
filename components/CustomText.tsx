import React from "react";
import { Text, StyleSheet } from "react-native";
import { TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  bold?: boolean;
  italic?: boolean;
}

const CustomText = ({
  children,
  style,
  bold,
  italic,
  ...rest
}: CustomTextProps) => {
  let fontFamily = bold ? "Bold" : "Regular";
  let fontStyle: "italic" | "normal" | undefined = italic ? "italic" : "normal";

  return (
    <Text
      style={[styles.defaultText, { fontFamily, fontStyle }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    // fontSize: 16,
  },
});

export default CustomText;

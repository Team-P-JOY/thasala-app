import CustomText from "@/components/CustomText";
import { theme } from "@/core/theme";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput as Input } from "react-native-paper";

const CustomTextInput = ({ errorText, ...props }: any) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      {...props}
    />
    {errorText ? (
      <CustomText style={styles.error}>{errorText}</CustomText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 5,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(CustomTextInput);

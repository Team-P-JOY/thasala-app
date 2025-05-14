import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Modal as Modals, Portal } from "react-native-paper";
import CustomText from "./CustomText";
import { theme } from "@/core/theme";

interface ModalComponentProps {
  visible: boolean;
  title: string;
  description?: string;
  hideModal: () => void;
  accept: () => void;
  cancelText?: string;
  acceptText?: string;
  acceptColor?: string;
}

const Modal = ({
  visible,
  title,
  description = "",
  hideModal,
  accept,
  cancelText = "ปิด",
  acceptText = "ตกลง",
  acceptColor = theme.colors.primary,
}: ModalComponentProps) => {
  return (
    <Portal>
      <Modals
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <CustomText bold style={{ fontSize: 20, marginBottom: 10 }}>
            {title}
          </CustomText>
          <CustomText style={{ fontSize: 18, marginBottom: 30 }}>
            {description}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={hideModal}
              style={{
                borderWidth: 1,
                padding: 10,
                paddingHorizontal: 20,
                borderColor: "gray",
                borderRadius: 5,
              }}
            >
              <CustomText style={{ color: "gray" }}>{cancelText}</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hideModal();
                accept();
              }}
              style={{
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: acceptColor,
                borderRadius: 5,
              }}
            >
              <CustomText style={{ color: "white" }}>{acceptText}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modals>
    </Portal>
  );
};

export default Modal;

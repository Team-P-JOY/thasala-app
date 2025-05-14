import { View } from "react-native";
import { Appbar } from "react-native-paper";
import React from "react";
import CustomText from "./CustomText";
import { theme } from "@/core/theme";

interface TopBarProps {
  title: string;
  back?: () => void;
  right?: () => void;
  rightIcon?: string;
}

const CustomTopBar: React.FC<TopBarProps> = ({
  title,
  back,
  right,
  rightIcon,
}) => {
  return (
    <View>
      <Appbar.Header style={{ backgroundColor: "transparent", elevation: 0 }}>
        {back ? (
          <Appbar.BackAction onPress={back} color={theme.colors.primary} />
        ) : (
          <Appbar.Action size={30} icon="dots-vertical" color="transparent" />
        )}
        <Appbar.Content
          title={title}
          titleStyle={{
            fontSize: 18,
            color: theme.colors.primary,
            fontFamily: "Bold",
            textAlign: "center",
          }}
        />
        {right ? (
          <Appbar.Action
            size={30}
            icon={rightIcon ? rightIcon : "dots-vertical"}
            onPress={right}
            color={theme.colors.primary}
          />
        ) : (
          <Appbar.Action size={30} icon="dots-vertical" color="transparent" />
        )}
      </Appbar.Header>
    </View>
  );
};

export default CustomTopBar;

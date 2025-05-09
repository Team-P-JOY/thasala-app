import React, { useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { WebView as ShowWeb } from "react-native-webview";
import { theme } from "@/core/theme";

const WebPortal = ({ url }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    setKey((prevKey) => prevKey + 1);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              animating={true}
              color={theme.colors.primary}
            />
          </View>
        )}
        <ShowWeb
          key={key}
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff80",
    zIndex: 10,
  },
});

export default WebPortal;

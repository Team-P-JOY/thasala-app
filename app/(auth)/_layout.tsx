import { Slot } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    console.log("RootLayout");
  }, []);

  return <Slot />;
}

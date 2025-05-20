import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native"; // ✅ เพิ่ม View และ Text

export default function NotiListScreen() {
  const { module } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>
        โมดูลที่เลือก: {module}
      </Text>
    </View>
  );
}

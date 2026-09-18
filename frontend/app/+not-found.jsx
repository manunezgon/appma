import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "../hooks/useTranslation";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{t("notFound.message")}</Text>
      </View>
    </>
  );
}

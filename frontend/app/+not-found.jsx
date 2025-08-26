import { Stack } from 'expo-router';
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Oops! this screen dosent exist.</Text>
      </View>
    </>
  );
}
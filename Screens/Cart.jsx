import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export default function Cart() {
  const navigation = useNavigation();
  return (
    <View>
      <Text
        onPress={async () => {
          
          navigation.push("HomePage");
        }}
      >
        Cart PAge
      </Text>
    </View>
  );
}

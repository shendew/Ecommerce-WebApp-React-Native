import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from "react-native";

function LoginPage() {
  const navigation = useNavigation();
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");

  return (
    <SafeAreaView>
      <Text>LoginPage</Text>
      <TextInput onChangeText={onChangeUseremail} value={UserEmail} />

      <TextInput onChangeText={onChangeUserpassword} value={UserPassword} />

      <TouchableOpacity onPress={()=>navigation.push("SignIn")}>
        <Text>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default LoginPage;

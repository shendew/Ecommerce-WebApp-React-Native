import { useNavigation } from "@react-navigation/native";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { StyleSheet, Image, TextInput } from "react-native";

function Register() {
  const navigation = useNavigation();
  const [FirstName, onChangeFirstname] = React.useState("");
  const [LastName, onChangeLastname] = React.useState("");
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/loginbacground.png")}
        style={{
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.subContainer}>
          <Image
            source={require("../img/logo.png")}
            style={{ width: "30%", height: "20%" }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: 700,
              marginBottom: 50,
              color: "black",
            }}
          >
            Sign Up
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor={"white"}
            onChangeText={onChangeFirstname}
            value={FirstName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor={"white"}
            onChangeText={onChangeLastname}
            value={LastName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={"white"}
            onChangeText={onChangeUseremail}
            value={UserEmail}
          />

          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"white"}
            onChangeText={onChangeUserpassword}
            value={UserPassword}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "yellow",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "90%",
              borderRadius: 25,
              marginBottom: 10,
            }}
            onPress={() => navigation.push("HomePage")}
          >
            <Text
              style={{ textAlign: "center", color: "black", fontWeight: 600 }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: "90%", alignContent: "center" }}
            onPress={() => navigation.push("Register")}
          >
            <Text style={{ fontSize: 12, color: "maroon" }}>
              Already a member?
              <Text style={{ fontWeight: 700 }}> SignIn</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  subContainer: {
    backgroundColor: "white",
    opacity: 0.7,
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  textInput: {
    color: "white",
    textAlign: "left",

    width: "90%",
    marginBottom: 20,
    borderRadius: 17,
    borderColor: "white",
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 25,
  },
});

export default Register;

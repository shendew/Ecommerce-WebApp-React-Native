import { useNavigation } from "@react-navigation/native";
import { ImageBackground, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { Component } from "react";
import { StyleSheet, Image, TextInput } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { placeholderTextColor } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";
import validator from "validator";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuth, useUpdateAuth } from "../Context/AuthContext";
import { BaseUrl } from "../Utils/Constrains";
// import uuid from "react-native-uuid";

function Register() {
  const authHandler = useUpdateAuth();

  const navigation = useNavigation();
  const [FirstName, onChangeFirstname] = React.useState("");
  const [LastName, onChangeLastname] = React.useState("");
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");
  const [UserConfirmPassword, onChangeUserConfirmpassword] = React.useState("");

  const [isEmailWrong, setIsEmailWrong] = React.useState(false);
  const [isConfrimPassWrong, setIsConfrimPassWrong] = React.useState(false);
  const [isPassWrong, setIsPassWrong] = React.useState(false);
  const [localOtp, setLocalOtp] = React.useState("");


  const sendOTP = () => {
    const temp_otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
    setLocalOtp(temp_otp);

    axios
      .post(
        BaseUrl + '/auth/otp',
        {
          UserEmail: UserEmail,
          OTP: temp_otp,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(response => {
        if (response.data.status == 'success') {

          Toast.show({
            type: 'success',
            text1: 'OTP Sent',
            text2: 'Otp is successfully sent to your email.',
          });

          navigation.push("OTPVeri", {
            UserEmail: UserEmail,
            FirstName: FirstName,
            LastName: LastName,
            UserPassword: UserPassword,
            localOTP:temp_otp
          });
        } else {
          Alert.alert('OTP sent failed :' + response.data);
        }
      })
      .catch(value => {
        Alert.alert('OTP sent failed');
      });
  };
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
              color: "#00000",
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
            style={[
              styles.textInput,
              { borderColor: isEmailWrong ? "red" : "#ffffff" },
            ]}
            placeholder="Email"
            placeholderTextColor={isEmailWrong ? "red" : "#ffffff"}
            onChangeText={onChangeUseremail}
            value={UserEmail}
            onFocus={() => {
              setIsEmailWrong(false);
            }}
          />

          <TextInput
            style={[
              styles.textInput,
              { borderColor: isPassWrong ? "red" : "#ffffff" },
            ]}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={isPassWrong ? "red" : "#ffffff"}
            onChangeText={onChangeUserpassword}
            onFocus={() => {
              setIsPassWrong(false);
            }}
            value={UserPassword}
          />
          <TextInput
            style={[
              styles.textInput,
              { borderColor: isConfrimPassWrong ? "red" : "#ffffff" },
            ]}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={isConfrimPassWrong ? "red" : "#ffffff"}
            onChangeText={onChangeUserConfirmpassword}
            onFocus={() => {
              setIsConfrimPassWrong(false);
            }}
            value={UserConfirmPassword}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#eee600",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "90%",
              borderRadius: 25,
              marginBottom: 10,
            }}
            onPress={() => {
              if (UserPassword != UserConfirmPassword) {
                setIsConfrimPassWrong(true);
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: "Confirm password is missmatch",
                });
              } else {
                if (validator.isEmail(UserEmail)) {
                  var validData=passwordValidator(UserPassword);
                
                  if(validData==''){
                                        if (FirstName != "" && LastName != "") {

                        sendOTP();                      
                    } else {
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Fill all fields",
                      });
                    }
                  } else {
                    setIsPassWrong(true);
                    Alert.alert(validData);
                    // Toast.show({
                    //   type: "error",
                    //   text1: "Error",
                    //   text2: "Password need atleast 8 characters",
                    // });
                  }
                } else {
                  setIsEmailWrong(true);
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Email is wrong!",
                  });
                }
              }
            }}
          >
            <Text
              style={{ textAlign: "center", color: "#00000", fontWeight: 600 }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: "90%", alignContent: "center" }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 12, color: "#7c0a0a" }}>
              Already a member?
              <Text style={{ fontWeight: 700 }}> SignIn</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <Toast style={{ position: "absolute" }} />
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
    minHeight: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  textInput: {
    color: "#ffffff",
    textAlign: "left",

    width: "90%",
    marginBottom: 20,
    borderRadius: 17,
    borderColor: "#ffffff",
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 25,
  },
});

export default Register;

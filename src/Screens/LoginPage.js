import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth, useUpdateAuth } from "../Context/AuthContext";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useState } from "react";
import Loading from "../Utils/Loading";
import { passwordValidator } from "../Validators/PasswordValidator";
import { BaseUrl } from "../Utils/Constrains";

function LoginPage() {
  const navigation = useNavigation();
  
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");

  const authHandler = useUpdateAuth();
  const [isLoading,setIsLoading]=useState(false);

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
        {
          isLoading?<Loading/>:
        
        <View style={styles.subContainer}>
          <Image
            source={require("../img/logo.png")}
            style={{ width: "30%", height: "30%" }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: 700,
              marginBottom: 50,
              color: "#000000",
            }}
          >
            Login
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={"#ffffff"}
            onChangeText={onChangeUseremail}
            value={UserEmail}
          />

          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"#ffffff"}
            onChangeText={onChangeUserpassword}
            value={UserPassword}
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
            onPress={async () => {
              setIsLoading(true)
              if (UserEmail != "" && UserPassword != "") {

                var validData=passwordValidator(UserPassword);
                
                if(validData==''){
                  axios
                  .post(
                    BaseUrl+"/auth/?UserEmail=" +
                      UserEmail +
                      "&UserPassword=" +
                      UserPassword,
                    {
                      headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                      },
                    }
                  )
                  .then(function (response) {
                    setIsLoading(false)
                    const da = response.data;
                    if (da.status == 101) {
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "You're not registered",
                      });
                    } else if (da.status == 102) {
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Server error",
                      });
                    } else if (da.status == 103) {
                      //success
                      AsyncStorage.setItem(
                        "AUTH_TOKEN",
                        (da.authKey)
                      )
                        .then(() => {
                          AsyncStorage.setItem(
                            "USER_EMAIL",
                            (UserEmail)
                          )
                            .then(() => {
                              
                              console.log("Token,Email saved successfully");
                              if(UserEmail=="td@gmail.com"){
                                AsyncStorage.setItem(
                                  "USER_TYPE",
                                  "true"
                                )
                                authHandler(true,true);
                                
                              }else{
                                AsyncStorage.setItem(
                                  "USER_TYPE",
                                  "false"
                                )
                                authHandler(true,false);
                              }
                            })
                            .catch((error) => {
                              Alert.alert("Please try again later.");
                              console.error("Error saving email:", error);
                            });
                          
                        })
                        .catch((error) => {
                          Alert.alert("Please try again later.");
                          console.error("Error saving token:", error);
                        });


                    } else if (da.status == 104) {
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Password wrong",
                      });
                    }
                  })
                  .catch(function (error) {
                    setIsLoading(false)
                    Toast.show({
                      type: "error",
                      text1: "Error",
                      text2: "Something went wrong!",
                    });
                  });
                }else{
                  Alert.alert(validData);
                }
                
              } else {
                setIsLoading(false)
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: "Fill all fields",
                });
              }
            }}
          >
            <Text
              style={{ textAlign: "center", color: "#000000", fontWeight: 600 }}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: "90%" }}
            onPress={() => navigation.push("SignIn")}
          >
            <Text style={{ fontSize: 12, color: "#7c0a0a" }}>
              Haven't registered yet,
              <Text style={{ fontWeight: 700 }}>Click here</Text>
            </Text>
          </TouchableOpacity>
        </View>
        }
        <Toast />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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
  subContainer: {
    backgroundColor: "#ffffff",
    opacity: 0.7,
    width: "90%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});

export default LoginPage;

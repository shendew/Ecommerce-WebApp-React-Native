import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from 'lottie-react-native';
import { Alert } from "react-native";
import axios from "axios";
import { BaseUrl } from "../Utils/Constrains";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import Loading from "./Loading";


const OtpVerificationScreen = ({ route }) => {
    const {testData}=route.params;
  const [one, setOne] = useState(0);
  const [two, setTwo] = useState(0);
  const [three, setThree] = useState(0);
  const [four, setFour] = useState(0);

  const [isLoading,setIsLoading]=useState(true);

  const [otpSent,setOtpSent]=useState(false);
  const[localOtp,setLocalOtp]=useState();



  const sendOTP=()=>{
    const temp_otp=Math.floor(Math.random() * (9999-1111+1))+1111;
    setLocalOtp(temp_otp);

    axios
    .post(
      BaseUrl+"/auth/otp",{
        UserEmail:route.params.UserEmail,
        OTP:temp_otp
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
       
      }
    ).then((response) => {
        console.log(response.data)
        if(response.data.status=="success"){
            Alert.alert("OTP sent successfully")
            setOtpSent(true);
            setIsLoading(false);
        }else{
            Alert.alert("OTP sent failed :" +response.data)
        }
    }).catch((value) => {
        Alert.alert("OTP sent failed")
    })
  }



  const uploadData = async() => {

    axios
    .post(
      BaseUrl+"/auth/insert",{
        UserID:uuid.v4().toString(),
        UserFirstName:route.params.FirstName,
        UserLastName:route.params.LastName,
        UserEmail:route.params.UserEmail,
        UserPassword:route.params.UserPassword
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
       
      }
    )
    .then(function (response) {
      console.log(response.data);
      
      const da = response.data;
      if (da.status == 102) {
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
              (route.params.UserEmail)
            )
              .then(() => {
                console.log("Token,Email saved successfully");
                authHandler(true);
              })
              .catch((error) => {
                Alert.alert("Please try again later.");
                console.error("Error saving email:", error);
              });
          })
          .catch((error) => {
            
            console.error("Error saving token:", error);
          });
      } 
    })
    .catch(function (error) {
      console.log(error+uuid.v4())
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong!",
      });
    });
  };


  useEffect(() => {
    sendOTP()
  }, []);
  return (
    isLoading?<View style={{flex:1}}><Loading/></View>:
    <SafeAreaView style={{ flex: 1, }}>
      {/* <StatusBar/> */}
      
      <View style={{ flex: 1 ,alignItems:'center',justifyContent:'center'}}>
      <Text
        style={{
          fontSize: 50,
          fontWeight: 600,
          marginTop: useSafeAreaInsets().top,
          alignSelf:'center'
        }}
      >
        Is It You?
      </Text>
      <LottieView source={require('../anim/verify.json')} style={{width:'50%',height:200,alignSelf:'center'}} autoPlay loop />


        
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TextInput
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={one}
            onChangeText={(txt) => {
              setOne(txt);
            }}
          />
          <TextInput
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={two}
            onChangeText={(txt) => {
              setTwo(txt);
            }}
          />
          <TextInput
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={three}
            onChangeText={(txt) => {
              setThree(txt);
            }}
          />
          <TextInput
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={four}
            onChangeText={(txt) => {
              setFour(txt);
            }}
          />
        </View>
        <TouchableOpacity style={{width:'80%',height:50,alignItems:'center',justifyContent:'center',padding:10,marginTop:20,backgroundColor:'blue',borderRadius:15}} 
        onPress={()=>{
            const userOTP=(""+one+two+three+four);
            if(userOTP == localOtp){
                uploadData();
            }else{
                Alert.alert("Wrong OTP"+userOTP)
            }
        }}>
            <Text style={{color:'white',fontSize:19,fontWeight:600}}>Verify</Text>
        </TouchableOpacity>

        {
            otpSent?<Text style={{ margin: 10 }}>OTP has sent it to {route.params.UserEmail}</Text>:<View></View>
        }
        

        <TouchableOpacity>
            <Text>Resend in {5}min</Text>
            <Text style={{color:'red',fontWeight:600}}>Resend now</Text>
        </TouchableOpacity>
      </View>
      <Toast style={{ position: "absolute" }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpInput: {
    padding: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius:7,
    textAlign: "center",
    fontSize: 20,
  },
});

export default OtpVerificationScreen;

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {Alert} from 'react-native';
import axios from 'axios';
import {BaseUrl, LocalBaseUrl} from '../Utils/Constrains';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Loading from '../Utils/Loading';
import {useUpdateAuth} from '../Context/AuthContext';

const OtpVerificationScreen = ({route}) => {
  const authHandler = useUpdateAuth();

  const {testData} = route.params;

  const [otpReload, setOtpReload] = useState(0);
  const [one, setOne] = useState(0);
  const [two, setTwo] = useState(0);
  const [three, setThree] = useState(0);
  const [four, setFour] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [localOtp, setLocalOtp] = useState("");

  const sendOTP = () => {
    const temp_otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
    setLocalOtp(temp_otp);

    axios
      .post(
        BaseUrl + '/auth/otp',
        {
          UserEmail: route.params.UserEmail,
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
          Alert.alert('OTP sent successfully');
          setOtpSent(true);
          setIsLoading(false);
        } else {
          Alert.alert('OTP sent failed :' + response.data);
        }
      })
      .catch(value => {
        Alert.alert('OTP sent failed');
      });
  };

  const uploadData = async () => {
    const fname = route.params.FirstName;
    const lname = route.params.LastName;
    const em = route.params.UserEmail;
    const pwd = route.params.UserPassword;
    try {
      axios
        .post(
          BaseUrl + '/auth/insert',
          {
            UserID: uuid.v4() + '',
            UserFirstName: fname,
            UserLastName: lname,
            UserEmail: em.toLowerCase(),
            UserPassword: pwd,
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
          },
        )
        .then(response => {
          setIsLoading(false)
          const da = response.data;
          if (da.status == 102) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Server error',
            });
          } else if (da.status == 103) {
            Toast.show({
              type: 'success',
              text1: 'Welcome Back',
              text2: 'You will be automatically redirect to our home page.',
            });
            AsyncStorage.setItem('AUTH_TOKEN', da.authKey)
              .then(() => {
                AsyncStorage.setItem('USER_EMAIL', em)
                  .then(() => {
                    console.log('Token,Email saved successfully');
                    AsyncStorage.setItem('USER_TYPE', 'false');
                    authHandler(true, false);
                  })
                  .catch(error => {
                    Alert.alert('Please try again later.');
                    console.log('Error saving email:', error);
                  });
              })
              .catch(error => {
                Alert.alert('Please try again later.');
                console.log('Error saving token:', error);
              });
          } else if (da.status == 106) {
            Toast.show({
              type: 'error',
              text1: 'Email already in use',
              text2: 'This email is used for a another account',
            });
          }
        })
        .catch(function (error) {
          setIsLoading(false)
          console.log(error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong!',
          });
        });
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };

  useEffect(() => {

  }, []);
  return isLoading ? (
    <View style={{flex: 1}}>
      <Loading />
    </View>
  ) : (
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar/> */}

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 50,
            fontWeight: 600,
            marginTop: useSafeAreaInsets().top,
            alignSelf: 'center',
            color:'black'
          }}>
          Is It You?
        </Text>
        <LottieView
          source={require('../anim/verify.json')}
          style={{width: '50%', height: 200, alignSelf: 'center'}}
          autoPlay
          loop={false}
        />

        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TextInput
          ref={(input) => { this.firstTextInput = input; }}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={one}
            onChangeText={txt => {
              setOne(txt);
              if(!txt.trim()==""){
                this.secondTextInput.focus();
              }
            }}
            blurOnSubmit={false}

          />
          <TextInput
          ref={(input) => { this.secondTextInput = input; }}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={two}
            onChangeText={txt => {
              setTwo(txt);
              if(!txt.trim()==""){
                this.thirdTextInput.focus();
              }else{
                  this.firstTextInput.focus();
              }
            }}
            blurOnSubmit={false}

          />
          <TextInput
          ref={(input) => { this.thirdTextInput = input; }}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={three}
            onChangeText={txt => {
              setThree(txt);
              if(!txt.trim()==""){
                this.fourthextInput.focus();
              }else{
                  this.secondTextInput.focus();
              }
            }}
            blurOnSubmit={false}

          />
          <TextInput
          ref={(input) => { this.fourthextInput = input; }}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
            value={four}
            onChangeText={txt => {
              setFour(txt);
              if(!txt.trim()==""){
              }else{
                  this.thirdTextInput.focus();
              }
            }}
            blurOnSubmit={false}

          />
        </View>
        <TouchableOpacity
          style={{
            width: '80%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            marginTop: 20,
            backgroundColor: 'blue',
            borderRadius: 15,
          }}
          onPress={() => {
            const userOTP = '' + one + two + three + four;
            if (userOTP == route.params.localOTP) {
              setIsLoading(true)
              uploadData();
            } else {
              Alert.alert('Wrong OTP');
            }
          }}>
          <Text style={{color: 'white', fontSize: 19, fontWeight: 600}}>
            Verify
          </Text>
        </TouchableOpacity>

        {otpSent ? (
          <Text style={{margin: 10}}>
            OTP has sent it to {route.params.UserEmail}
          </Text>
        ) : (
          <View></View>
        )}

        <TouchableOpacity style={{alignItems:'center',marginTop:10}} onPress={()=>{sendOTP()}}>
          <Text style={{fontSize:11}}>Resend in {5}min</Text>
          <Text style={{fontSize:12,color: 'red', fontWeight: 600}}>Resend now</Text>
        </TouchableOpacity>
      </View>
      <Toast style={{ position: "absolute" }}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpInput: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 7,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default OtpVerificationScreen;

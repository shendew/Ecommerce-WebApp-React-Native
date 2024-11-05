import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BaseUrl, LocalBaseUrl} from '../Utils/Constrains';
import { emptyValidator } from '../Validators/emptyValidator';
import { passwordValidator } from '../Validators/PasswordValidator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Utils/Loading';

const PasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassErr, setOldPassErr] = useState(false);
  const [newPassErr, setNewPassErr] = useState(false);


  const validateInputs=()=>{
    setOldPassErr(emptyValidator(oldPassword))
    setNewPassErr(passwordValidator(newPassword))

    if(!oldPassErr && !newPassErr){
      getAuthToken();
      setIsLoading(true)
    }
  }

  const getAuthToken = async () => {
    await AsyncStorage.getItem("AUTH_TOKEN").then(async (a) => {
      await AsyncStorage.getItem("USER_EMAIL").then((e) => {
        
        resetPass( e, a );
      });
    });
  };

  const resetPass = (email,auth) => {
    console.log(email,auth)
    axios
      .post(
        BaseUrl + '/auth/updateU',
        {
          UserEmail: email,
          authKey: auth,
          oldPass: oldPassword,
          upData: newPassword,
          UpType: 'Pass',
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        setIsLoading(false)
        const da = response.data;
        if (da.status == 103) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Password reseted successfully.",
          });
          setOldPassword("");
          setNewPassword("");
        } else if (da.status == 105) {
          console.log('Wrong password');
          setOldPassErr(true)
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Server error",
          });
          console.log('Failed to update' + da.msg);
        }
      })
      .catch(function (error) {
        setIsLoading(false)
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Server error",
        });
        console.log(error);
      });
  };

  return isLoading?<Loading/>:(
    <View>
      <View
        style={{
          width: '100%',
          height: 60,
          backgroundColor: 'white',
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingBottom: 7,
          elevation: 1,
          alignItems: 'flex-end',
        }}>
        <Icon
          style={{}}
          name="angle-left"
          size={30}
          color="black"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text
          style={{
            fontSize: 19,
            textAlign: 'center',
            fontWeight: 600,
            flex: 1,
          }}>
          Reset Password
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <TextInput
          style={[
            styles.searchBox,
            {borderColor: oldPassErr ? 'red' : '#ffffff', borderWidth: 1},
          ]}
          placeholder="Old Password"
          placeholderTextColor={'#606060'}
          value={oldPassword}
          name={'old-pass'}
          onChangeText={value => setOldPassword(value)}
        />
        <TextInput
          style={[
            styles.searchBox,
            {borderColor: newPassErr ? 'red' : '#ffffff', borderWidth: 1},
          ]}
          placeholder="New Password"
          placeholderTextColor={'#606060'}
          value={newPassword}
          name={'new-pass'}
          onChangeText={value => setNewPassword(value)}
        />
        <Text style={{marginHorizontal:8,marginBottom:10,fontSize:12,color:'red'}}>
          {oldPassErr?"Old password is wrong.":newPassErr?"New password should be 8 Charactor long and must include Symbol,UpperCase,Numbers.":""}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#bb0000',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            height: 45,
            width: '80%',
            borderRadius: 15,
            marginBottom: 10,
            marginTop: 10,
          }}
          onPress={() => {
            validateInputs();
          }}>
          <Text style={{color: 'white', fontSize: 15, fontWeight: 600}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    padding: 10,
    textAlign: 'left',
    backgroundColor: '#ffffff',
    width: '93%',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default PasswordReset;

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BaseUrl} from '../Utils/Constrains';
import {useNavigation} from '@react-navigation/native';
import Loading from '../Utils/Loading';

const ProfileDetails = () => {
  const navigation = useNavigation();
  const updateText = useRef();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [type, setType] = useState('');
  const [auth, setAuth] = useState('');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('');
  const [localValue, setLocalValue] = useState('');
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthToken = async type => {
    await AsyncStorage.getItem('AUTH_TOKEN').then(async a => {
      setAuth(a);
      await AsyncStorage.getItem('USER_EMAIL').then(async e => {
        setEmail(e);
        getUser(a, e);
      });
    });
  };

  const getUser = async (a, e) => {
    axios
      .post(
        BaseUrl + '/auth/user',
        {
          UserEmail: e,
          authKey: a,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103) {
          setUser(da.value);
          setIsLoading(false);
        } else {
          console.log('Failed to get User' + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateProfile = () => {
    setIsLoading(true);
    let valType;
    switch (type) {
      case 'First Name':
        valType = 'Fname';
        break;
      case 'Last Name':
        valType = 'Lname';
        break;
      default:
        break;
    }

    axios
      .post(
        BaseUrl + '/auth/updateU',
        {
          UserEmail: email,
          authKey: auth,
          upData: value,
          UpType: valType,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103) {
          setIsLoading(false);
          setIsModalOpened(false);
          setIsLoading(true);
          getAuthToken();
        } else {
          console.log('Failed to update' + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getAuthToken();
  }, []);

  const handleModal = ty => {
    // let localValue;
    switch (ty) {
      case 'First Name':
        setValue(user.UserFirstName);
        setLocalValue(user.UserFirstName);
        break;
      case 'Last Name':
        setValue(user.UserLastName);
        setLocalValue(user.UserLastName);
        break;
      case 'User Email':
        setValue(user.UserEmail);
        setLocalValue(user.UserEmail);
        break;
      default:
        break;
    }
    setIsModalOpened(true);
  };

  return isLoading ? (
    <View style={{flex: 1}}>
      <Loading />
    </View>
  ) : (
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar backgroundColor={"white"} barStyle={"dark-content"} /> */}
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
          Profile Details
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}
        onPress={() => {
          setType('First Name');
          handleModal('First Name');
          setIsModalOpened(true);
        }}>
        <Text>First Name</Text>
        <View style={{flexDirection: 'row'}}>
          <Text>{user.UserFirstName}</Text>
          <Icon style={{marginLeft: 10}} name="angle-right" size={20} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}
        onPress={() => {
          setType('Last Name');
          handleModal('Last Name');
          setIsModalOpened(true);
        }}>
        <Text>Last Name</Text>
        <View style={{flexDirection: 'row'}}>
          <Text>{user.UserLastName}</Text>
          <Icon style={{marginLeft: 10}} name="angle-right" size={20} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}>
        <Text>User Email</Text>
        <View style={{flexDirection: 'row'}}>
          <Text>{user.UserEmail}</Text>
          <Icon style={{marginLeft: 10}} name="angle-right" size={20} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}
        onPress={() => {
          if (user.UserAddres.length > 0) {
            navigation.navigate('AddAddressScreen', {
              authKey: auth,
              Email: email,
              type: 'update',
              address: user.UserAddres[0],
            });
          } else {
            navigation.navigate('AddAddressScreen', {
              authKey: auth,
              Email: email,
              type: 'add',
            });
          }
        }}>
        <Text>User Address</Text>
        <View style={{flexDirection: 'row'}}>
          <Icon style={{marginLeft: 10}} name="angle-right" size={20} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          padding: 10,
        }}
        onPress={() => navigation.navigate('PasswordRest')}>
        <Text style={{color: 'red'}}>Reset Password</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpened}
        // onRequestClose={setIsModalOpened(false)}
      >
        <TouchableOpacity
          onPress={() => {
            setIsModalOpened(false);
            setValue('');
            setType('');
          }}
          style={{
            flex: 1,
            backgroundColor: '#000000AA',
            justifyContent: 'flex-end',
          }}>
          <TouchableWithoutFeedback
            style={{
              width: '100%',
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                height: '30%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 10,
                maxHeight: '40%',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{alignSelf: 'center', fontWeight: 600, fontSize: 17}}>
                {type}
              </Text>
              <View>
                <TextInput
                  ref={updateText}
                  style={{
                    borderRadius: 10,
                    borderColor: 'grey',
                    borderWidth: 1,
                    padding: 7,
                  }}
                  value={value}
                  onChangeText={txt => {
                    setValue(txt);
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  width: '90%',
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 15,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (localValue == value) {
                    setIsModalOpened(false);
                    setValue('');
                    setType('');
                  } else {
                    console.log('value has changed');
                    updateProfile();
                  }
                }}>
                <Text style={{color: 'white'}}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ProfileDetails;

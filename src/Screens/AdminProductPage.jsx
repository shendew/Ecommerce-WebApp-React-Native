import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderItem from './OrderItem';
import axios from 'axios';
import {BaseUrl} from '../Utils/Constrains';
import AdminOrderItem from './AdminOrderItem';
import AdminProductItem from './AdminProductItem';
import Loading from '../Utils/Loading';
import Toast from 'react-native-toast-message';

const AdminProductPage = () => {
  const navigation = useNavigation();
  const [data, setData] = useState('all');
  const [auth, setAuth] = useState('');
  const [email, setEmail] = useState('');
  const [Products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthToken = async () => {
    setIsLoading(true)
    await AsyncStorage.getItem('AUTH_TOKEN').then(async a => {
      setAuth(a);
      await AsyncStorage.getItem('USER_EMAIL').then(async e => {
        setEmail(e);
        getProducts();
      });
    });
  };

  const getProducts = () => {
    axios
      .get(
        BaseUrl + '/api/products',
        {
          params: {ReqType: 'all'},
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        const da = response.data.value;
        setProducts(da);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const reloadPage = () => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Delete successfully",
    });
    getAuthToken();
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAuthToken();
    });
  }, []);
  return (isLoading?<Loading/>:
    <View style={{flex: 1}}>
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
          My Products
        </Text>
      </View>
      <ScrollView>
        {Products.map((product, index, array) => (
          <AdminProductItem
            product={product}
            key={index}
            isUpdated={reloadPage}
          />
        ))}
      </ScrollView>
      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AdminProductPage;

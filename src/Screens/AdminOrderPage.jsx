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

const AdminOrderPage = () => {
  const navigation = useNavigation();
  const [data,setData]=useState('all');
  const [auth, setAuth] = useState('');
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const getAuthToken = async () => {
    await AsyncStorage.getItem('AUTH_TOKEN').then(async a => {
      setAuth(a);
      await AsyncStorage.getItem('USER_EMAIL').then(async e => {
        setEmail(e);
        getOrders(e, a);
      });
    });
  };

  const getOrders = (e, a) => {
    axios
      .post(
        BaseUrl + '/orders/getall',
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
        console.log(da.orders[0].productID)
        if (da.status == 103) {
          if (data == 'all') {
            setOrders(da.orders);
          } else if (data == -1) {
            setOrders(
              da.orders.filter(
                (value, index, array) => value.orderStatus == -1,
              ),
            );
          } else if (data == 0) {
            setOrders(
              da.orders.filter(
                (value, index, array) => value.orderStatus === 0,
              ),
            );
          } else if (data == 1) {
            setOrders(
              da.orders.filter(
                (value, index, array) =>
                  value.orderStatus === 1 && !value.reviewStatus,
              ),
            );
          } else if (data == 2) {
            setOrders(
              da.orders.filter(
                (value, index, array) => value.isCancled === true,
              ),
            );
          } else {
            setOrders(da.orders);
          }

          setIsLoading(false);
        } else {
          console.log('Failed to get Orders' + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const reloadPage=()=>{
    getAuthToken()
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAuthToken();
    });
  }, []);

  return (
    <View style={{flex: 1}}>
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
          My Orders(
          {data == 'all'
            ? 'All'
            : data == -1
            ? 'Pending'
            : data == 0
            ? 'Shipped'
            : data == 1
            ? 'Recieved'
            : 'Returning'}
          )
        </Text>
      </View>
      <ScrollView>
        {orders.map((order, index, array) => (
          <AdminOrderItem order={order} key={index} isUpdated={reloadPage}/>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AdminOrderPage;

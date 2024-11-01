import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native';

const OrderStatus = ({route}) => {
  const navigation = useNavigation();

  // Success

  useEffect(() => {}, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 150,
      }}>
      {route.params.status == 'Success' ? (
        <LottieView
          source={require('../anim/order_complete.json')}
          style={{width: '50%', height: 200, alignSelf: 'center'}}
          autoPlay
          loop={false}
        />
      ) : (
        <LottieView
          source={require('../anim/payment_failed.json')}
          style={{width: '50%', height: 200, alignSelf: 'center'}}
          autoPlay
          loop={false}

        />
      )}

      <Text style={{color: 'black', fontSize: 30, fontWeight: 700}}>
        Your Order is
      </Text>
      <Text style={{color: 'black', fontSize: 30, fontWeight: 700}}>
        {route.params.status}
      </Text>
      {route.params.status == 'Success' ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#00e55c',
            padding: 15,
            borderRadius: 10,
            marginTop: 0,
          }}
          onPress={() => {
              
              navigation.popToTop()
              navigation.navigate('myOrders', {type: 'all'})
            }}>
          <Text style={{color: 'white', fontWeight: 500}}>Go to My Orders</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#fd5c5e',
            padding: 15,
            borderRadius: 10,
            marginTop: 0,
          }}
          onPress={() => {
            navigation.popToTop()
            navigation.navigate('HomePage', {type: 'all'})
            }}>
          <Text style={{color: 'white', fontWeight: 500}}>Go to Home</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default OrderStatus;

import React from 'react';
import {
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import moment from 'moment/moment';
import {useEffect} from 'react';
import {Alert} from 'react-native';

import PayHere from '@payhere/payhere-mobilesdk-reactnative';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import {TouchableOpacity} from 'react-native';
import uuid from 'react-native-uuid';

import {BaseUrl} from '../Utils/Constrains';
import md5 from 'md5';
import ProItem from './ProItem';
import Loading from '../Utils/Loading';
import PlaceOrderItem from './PlaceOrderItem';

// TODO: Start from this page

const OrderPage = ({route}) => {
  const navigation = useNavigation();
  const [Product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [quantityC, setQuantityC] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [Address, setAddress] = useState('');
  const [isCOD, setIsCOD] = useState(true);

  const getHash = () => {
    let merchantSecret =
      'MTc1MjM2MjUzNjEwNzc4NTM4MDUzNjQ3MzcyODMyMjgzNTc5NzUzOA==';
    let merchantId = '1228394';
    let orderId = 'ItemNo12345';
    let amount = (
      ((Product.productPrice * (100 - Product.discountPercentage)) / 100) *
        quantityC +
      500
    ).toFixed(2);
    let hashedSecret = md5(merchantSecret).toString().toUpperCase();
    let amountFormated = parseFloat(amount)
      .toLocaleString('en-us', {minimumFractionDigits: 2})
      .replaceAll(',', '');
    let currency = 'LKR';
    let hash = md5(
      merchantId + orderId + amountFormated + currency + hashedSecret,
    )
      .toString()
      .toUpperCase();
    paymentObject.hash = hash;

    // console.log(paymentObject);
  };

  const paymentObject = {
    sandbox: true, // true if using Sandbox Merchant ID
    merchant_id: '1228394', // Replace your Merchant ID
    notify_url: '',
    order_id: 'ItemNo12345',
    items: '',
    amount: '1000.00',
    currency: 'LKR',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    delivery_address: '',
    delivery_city: '',
    delivery_country: 'Sri Lanka',
    hash: '',
  };

  const backAction = () => {
    Alert.alert(
      'Hold on!',
      "Are you sure you want to go back? \nYour data won't be save.",
      [
        {
          text: 'Stay',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Exit', onPress: () => navigation.goBack()},
      ],
    );
    return true;
  };

  const getProducts = async () => {
    axios
      .get(
        BaseUrl + '/api/products',
        {
          params: {ReqType: 'byid', productID: route.params.productID},
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          // params: { UserEmail: 'asi@gmail.com' , UserPassword:'Pakaya123_Updated' },
        },
      )
      .then(function (response) {
        const da = response.data.value;
        setProduct(da[0]);

        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAddress = async () => {
    setIsAddressLoading(true);
    axios
      .post(
        BaseUrl + '/auth/address',
        {
          UserEmail: route.params.Email,
          authKey: route.params.authKey,
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
          setAddress(da.address);
          console.log(da.address[0]);
          console.log(da.address);
          setIsAddressLoading(false);
        } else {
          console.log('Failed to get Address' + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addOrder = (orderID,pM) => {
    axios
      .post(
        BaseUrl + '/orders/add',
        {
          UserEmail: route.params.Email,
          authKey: route.params.authKey,

          orderID: orderID,
          productID: Product.productID,
          productPrice: Product.productPrice,
          productDiscount: Product.discountPercentage,
          productQuantity: quantityC,
          totalPrice: (
            ((Product.productPrice * (100 - Product.discountPercentage)) /
              100) *
              quantityC +
            500
          ).toFixed(2),
          shippingCost: 500,
          shippingMethod: pM,
          orderDate: new Date(),
          orderAddress: {
            first_name: Address[0].FName,
            last_name: Address[0].LName,
            address: Address[0].Address,
            province: Address[0].Provice,
            zipcode: Address[0].ZipCode,
            number: Address[0].Number,
            city: Address[0].City,
            country: Address[0].Country,
            land_marks: Address[0].Landmarks,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        setIsLoading(false);
        const da = response.data;
        if (da.status == 103) {
          console.log('Success');
          navigation.navigate('OrderStatus', {status: 'Success'});
        } else {
          console.log('Failed to update' + da.msg);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  const placeOrder = async => {
    getHash();

    const obj = paymentObject;

    if (Address.length == 0) {
      Alert.alert('Address is required');
    } else {
      const OrderID = uuid.v1();
      paymentObject.order_id=OrderID;
      if (isCOD) {
        addOrder(OrderID, 0);
      } else {
        paymentObject.items = Product.productTitle;
        paymentObject.amount =
          '' +
          (
            ((Product.productPrice * (100 - Product.discountPercentage)) /
              100) *
              quantityC +
            500
          ).toFixed(2);
        paymentObject.first_name = Address[0].FName;
        paymentObject.last_name = Address[0].LName;
        paymentObject.email = '';
        paymentObject.phone = Address[0].Number;
        paymentObject.address = Address[0].Address;
        paymentObject.delivery_address = Address[0].Address;

        paymentObject.city = Address[0].City;
        paymentObject.country = Address[0].Country;
        paymentObject.delivery_city = Address[0].City;
        paymentObject.delivery_country = Address[0].Country;

        console.log(paymentObject);

        PayHere.startPayment(
          paymentObject,
          paymentId => {
            console.log('Payment Completed', paymentId);
            addOrder(OrderID,1);
          },
          errorData => {
            navigation.navigate('OrderStatus', {
              status: 'Failed',
              error: errorData,
            });
          },
          () => {
            console.log('Payment Dismissed');
          },
        );
      }
    }

    // const dateAndTime = moment().format("DD/MM/YYYY HH:mm:ss");
    // axios.post(BaseUrl + "/auth/cart", {
    //   UserEmail: e,
    //   authKey: a,
    //   productID: route.params.data.productID,
    //   QTY: 1,
    //   UnitPrice: route.params.data.productPrice,
    //   discountPercentage: route.params.data.discountPercentage,
    //   OrderDate: dateAndTime,
    //   BillingAddress: "",
    //   ShippingAddress: "",
    //   PaymentMethod: "",
    // });
  };

  useEffect(() => {
    getProducts();
    getAddress();

    navigation.addListener('focus', () => {
      console.log('Address refreshed');
      getAddress();
    });

    const bacHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => bacHandler.remove();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={isDark ? 'black' : 'white'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <ScrollView>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 600,
              paddingHorizontal: 10,
              paddingVertical: 20,
              backgroundColor: 'white',
              color: 'black',
            }}>
            Place order
          </Text>

          <PlaceOrderItem data={Product} />

          <View
            style={{
              backgroundColor: 'white',
              // width: "80%",
              borderRadius: 10,
              padding: 10,
              // paddingVertical: 20,
              flexDirection: 'column',
            }}>
            <Text>Select the Quantity</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                alignSelf: 'flex-end',
                width: '20%',
                marginRight: 10,
              }}>
              <Icon
                name="minus"
                size={10}
                color="black"
                onPress={() => {
                  setQuantityC(old => (old == 1 ? old : old - 1));
                }}
              />
              <Text style={{marginVertical: 10, alignSelf: 'center'}}>
                {quantityC}
              </Text>
              <Icon
                name="plus"
                size={10}
                color="black"
                onPress={() => {
                  setQuantityC(old => old + 1);
                }}
              />
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              // height: "20%",
              borderRadius: 10,
              marginHorizontal: 5,
              backgroundColor: 'white',
              marginTop: 7,
              paddingVertical: 10,
            }}>
            {isAddressLoading ? (
              <Loading />
            ) : (
              <View>
                {Address.length == 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AddAddressScreen', {
                        authKey: route.params.authKey,
                        Email: route.params.Email,
                        type: 'add',
                      });
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="plus" size={12} style={{marginRight: 5}} />
                      <Text style={{}}>Add Address</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    onPress={() => {
                      navigation.navigate('AddAddressScreen', {
                        authKey: route.params.authKey,
                        Email: route.params.Email,
                        type: 'update',
                        address: Address[0],
                      });
                    }}>
                    <Icon2 name="location" size={20} style={{margin: 20}} />
                    <View style={{flex: 1, width: '100%'}}>
                      <Text size={15} style={{fontWeight: 600, color: 'black'}}>
                        {Address[0].Address}
                      </Text>
                      <Text
                        style={{fontSize: 12, fontWeight: 600, color: 'black'}}>
                        {Address[0].FName + ' ' + Address[0].LName}
                      </Text>
                      <Text
                        style={{fontSize: 12, fontWeight: 600, color: 'black'}}>
                        {Address[0].Number}
                      </Text>
                    </View>
                    <Icon2
                      name="chevron-small-right"
                      size={20}
                      style={{margin: 15}}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View
            style={{
              backgroundColor: 'white',
              marginTop: 20,
              padding: 10,
              borderRadius: 10,
              marginHorizontal: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 10,
                color: 'black',
              }}>
              Payment methods
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 9,
                borderWidth: 0,
                borderRadius: 7,
                marginBottom: 7,
                backgroundColor: isCOD ? 'lightgrey' : 'white',
              }}
              onPress={() => setIsCOD(true)}>
              <Text style={{color: 'black'}}>Cash on Delivery </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 9,
                borderWidth: 0,
                borderRadius: 7,
                backgroundColor: !isCOD ? 'lightgrey' : 'white',
              }}
              onPress={() => setIsCOD(false)}>
              <Text style={{color: 'black'}}>Card Payment</Text>
            </TouchableOpacity>

            <View style={{alignItems: 'center', marginTop: 10}}>
              {isCOD ? (
                <Text>Order will placed after pressing "Place Order"</Text>
              ) : (
                <Text>
                  You can select payment details after pressing "Place Order"
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              marginTop: 20,
              padding: 10,
              borderRadius: 10,
              marginHorizontal: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 10,
                color: 'black',
              }}>
              Order Summery
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black'}}>Product Price </Text>
              <Text style={{color: 'black'}}>
                LKR: {Product.productPrice * quantityC}
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black'}}>Discount </Text>
              <Text style={{color: 'black'}}>
                - LKR:{' '}
                {(
                  ((Product.productPrice * Product.discountPercentage) / 100) *
                  quantityC
                ).toFixed(2)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black'}}>Delivery Charges </Text>
              <Text style={{color: 'black'}}>LKR: {500}</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 600, color: 'black'}}>
                Total Price{' '}
              </Text>
              <Text style={{fontWeight: 600, color: 'black'}}>
                LKR:{' '}
                {(
                  ((Product.productPrice * (100 - Product.discountPercentage)) /
                    100) *
                    quantityC +
                  500
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{height: '10%', flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, fontWeight: 600, marginLeft: 10}}>
            {'LKR : ' +
              (
                ((Product.productPrice * (100 - Product.discountPercentage)) /
                  100) *
                  quantityC +
                500
              ).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#7c0a0a',
            flex: 1,
            justifyContent: 'center',
            borderRadius: 5,
            margin: 5,
            height: 40,
          }}
          onPress={async () => {
            // navigation.navigate("orderWeb")
            placeOrder();
            // Alert.alert("Order Processing", "Please wait a moment");
            // setIsLoading(true);
            // openDialog(true);
            // navigation.navigate("OrderScreen", {
            //   productID: route.params.data.productID,
            //   authKey: auth,
            //   Email: email,
            //   quantity: quantityC,
            // });
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 600,
              color: 'white',
            }}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'white',
    // display:flex,
    flexDirection: 'column',
  },
});

export default OrderPage;

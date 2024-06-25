import React from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import axios from "axios";
import moment from "moment/moment";
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

// TODO: Start from this page

const OrderPage = ({route}) => {
    const navigation=useNavigation();
    const [Product,setProduct] = useState();

    const getProducts = async () => {
        axios
          .get(
            "https://ebuy-backend.onrender.com"+"/api/products",
            {
              params: { ReqType: "byid",productID:route.params.productID },
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
              // params: { UserEmail: 'asi@gmail.com' , UserPassword:'Pakaya123_Updated' },
            }
          )
          .then(function (response) {
            const da = response.data.value;
            
              setProduct(da[0]);
            
            // setIsLoading(false)
          })
          .catch(function (error) {
            console.log(error);
          });
      };

    const placeOrder=(async)=>{

        const dateAndTime= moment().format("DD/MM/YYYY HH:mm:ss")
        axios.post("https://ebuy-backend.onrender.com" + "/auth/cart",
          {
              UserEmail: e,
              authKey: a,
              productID: route.params.data.productID,
              QTY: 1,
              UnitPrice:route.params.data.productPrice,
              discountPercentage:route.params.data.discountPercentage,
              OrderDate:dateAndTime,
              BillingAddress:"",
              ShippingAddress:"",
              PaymentMethod:"",
    
          }
          )
      }

      useEffect(() => {
        
        getProducts();
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to go back? \nYour data won\'t be save.', [
              {
                text: 'Stay',
                onPress: () => null,
                style: 'cancel',
              },
              {text: 'Exit', onPress: () => navigation.goBack()},
            ]);
            return true;
          };
      
        const bacHandler=BackHandler.addEventListener('hardwareBackPress', backAction);

        return ()=> bacHandler.remove();
      }, []);

    return (
        <View style={styles.container}>
            <Text>Place order</Text>
            <Text>{Product.productTitle}</Text>
            <Text>{route.params.quantity}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        // display:flex,
        flexDirection:'column'
    }
})

export default OrderPage;

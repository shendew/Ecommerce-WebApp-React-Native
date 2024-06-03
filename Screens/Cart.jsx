import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import CartItem from "./CartItem";
import axios from "axios";

export default function Cart() {
  const navigation = useNavigation();
  const [auth,setAuth]=useState("");
  const [email,setEmail]=useState("");
  const [Products,setProducts]=useState();
  const [QTY,setQTY]=useState();

  const getAuthToken = async () => {
    
        await AsyncStorage.getItem('AUTH_TOKEN').then(async (a) => {
          await AsyncStorage.getItem('USER_EMAIL').then((e) => {
            setAuth(a);
            setEmail(e);
            getProducts({e,a});
          })
        })

  };

  const getProducts = async ({e,a}) => {
    axios
      .post("https://ebuy-sl-39c4d4a9e148.herokuapp.com/auth/cart",{
        UserEmail:e,
        authKey:a
      },{
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
      .then(function (response) {
        const da=response.data.value;
          setProducts(da)
          console.log(response.data)
          setQTY(response.data.cart)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
     getAuthToken();
    
  }, []);

  return (
    <View>
      <FlatList
        data={Products}
        renderItem={CartItem}
        scrollEnabled
      />
    </View>
  );
}

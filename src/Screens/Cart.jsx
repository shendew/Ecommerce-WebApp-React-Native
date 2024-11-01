import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import CartItem from "./CartItem";
import axios from "axios";
import Loading from "../Utils/Loading";
import { BaseUrl } from "../Utils/Constrains";

// import { useReducer } from "react";

export default function Cart() {
  const navigation = useNavigation();
  const [auth, setAuth] = useState("");
  const [email, setEmail] = useState("");
  const [Products, setProducts] = useState();
  // const [QTY, setQTY] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshed, setIsRefreshed] = useState(false);
  // const [ReducerVal, forceUpdate] = useReducer((x) => x + 1, 0);

  const [totalPrice, setTotalPrice] = useState(0);

  const refreshStat = (isrefresh) => {
    console.log("updated");
    setIsLoading(true);
    setIsRefreshed(true);
    // window.location.reload(false)
    // forceUpdate();
  };

  const getAuthToken = async () => {
    setIsLoading(true);
    await AsyncStorage.getItem("AUTH_TOKEN").then(async (a) => {
      await AsyncStorage.getItem("USER_EMAIL").then((e) => {
        setAuth(a);
        setEmail(e);
        getProducts({ e, a });
      });
    });
  };

  const getProducts = async ({ e, a }) => {
    axios
      .post(
        BaseUrl + "/auth/cart",
        {
          UserEmail: e,
          authKey: a,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data.value;
        setProducts(da);
        setIsLoading(false);
        setIsRefreshed(false);
        calcTotalPrice(da);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const calcTotalPrice = (da) => {
    var tempTotal = 0;
    da.map((product, index, array) => {
      tempTotal =
        tempTotal +
        ((product.product.productPrice *
          (100 - product.product.discountPercentage)) /
          100) *
          product.cartData.QTY;
    });
    setTotalPrice(tempTotal);
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getAuthToken();
    });

    getAuthToken();
  }, [isRefreshed]);

  return isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={Products}
          renderItem={({ item, index }) => {
            return (
              <CartItem
                product={item.product}
                index={index}
                qty={item.cartData}
                auth={auth}
                email={email}
                reFreshStat={refreshStat}
              />
            );
          }}
          scrollEnabled
        />
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>LKR:{totalPrice}</Text>
        <Button title="Checkout" onPress={() => {
          navigation.navigate("CartOrderPage",{data:Products,Email:email,authKey:auth})
        }} />
      </View>
    </SafeAreaView>
  );
}

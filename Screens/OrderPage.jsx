import React from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import moment from "moment/moment";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import ProItem from "./ProItem";
import PlaceOrderItem from "./PlaceOrderItem";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

// TODO: Start from this page

const OrderPage = ({ route }) => {
  const navigation = useNavigation();
  const [Product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [quantityC, setQuantityC] = useState(1);

  const backAction = () => {
    Alert.alert(
      "Hold on!",
      "Are you sure you want to go back? \nYour data won't be save.",
      [
        {
          text: "Stay",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Exit", onPress: () => navigation.goBack() },
      ]
    );
    return true;
  };

  const getProducts = async () => {
    axios
      .get(
        "https://ebuy-backend.onrender.com" + "/api/products",
        {
          params: { ReqType: "byid", productID: route.params.productID },
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
        console.log(da[0]);
        setProduct(da[0]);

        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const placeOrder = (async) => {
    const dateAndTime = moment().format("DD/MM/YYYY HH:mm:ss");
    axios.post("https://ebuy-backend.onrender.com" + "/auth/cart", {
      UserEmail: e,
      authKey: a,
      productID: route.params.data.productID,
      QTY: 1,
      UnitPrice: route.params.data.productPrice,
      discountPercentage: route.params.data.discountPercentage,
      OrderDate: dateAndTime,
      BillingAddress: "",
      ShippingAddress: "",
      PaymentMethod: "",
    });
  };

  useEffect(() => {
    getProducts();
    const bacHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => bacHandler.remove();
  }, []);

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginHorizontal: 10,
            marginVertical: 20,
          }}
        >
          Place order
        </Text>

        <PlaceOrderItem data={Product} />

        <View
          style={{
            backgroundColor: "white",
            // width: "80%",
            borderRadius: 10,
            padding: 10,
            // paddingVertical: 20,
            flexDirection: "column",
          }}
        >
          <Text>Select the Quantity</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              alignSelf: "flex-end",
              width: "20%",
              marginRight: 10,
            }}
          >
            <Icon
              name="minus"
              size={10}
              color="black"
              onPress={() => {
                setQuantityC((old) => (old == 1 ? old : old - 1));
              }}
            />
            <Text style={{ marginVertical: 10, alignSelf: "center" }}>
              {quantityC}
            </Text>
            <Icon
              name="plus"
              size={10}
              color="black"
              onPress={() => {
                setQuantityC((old) => old + 1);
              }}
            />
          </View>
        </View>

        <View>
          <Text>Address</Text>
        </View>

        <View style={{backgroundColor: "white",marginTop:20,padding:10}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text>Product Price  </Text>
          <Text>LKR:{Product.productPrice*quantityC}</Text>
          </View>
        
        <Text>Discount Precentage {Product.discountPercentage} %</Text>
        <Text>After Discount  LKR:{(((Product.productPrice * (100 - Product.discountPercentage)) /100) *quantityC).toFixed(2)}</Text>
        <Text>Delivery Charges LKR: {500} </Text>
        <Text>Total Price LKR: {((((Product.productPrice * (100 - Product.discountPercentage)) /100) *quantityC)+500).toFixed(2)} </Text>
        </View>
      </View>
      <View
        style={{ height: "10%", flexDirection: "row", alignItems: "center" }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
            {"LKR : " +
              (
                (((Product.productPrice * (100 - Product.discountPercentage)) /
                  100) *
                quantityC
              )+500).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#7c0a0a",
            flex: 1,
            justifyContent: "center",
            borderRadius: 5,
            margin: 5,
            height: 40,
          }}
          onPress={async () => {
            Alert.alert("Order Processing","Please wait a moment")
            // setIsLoading(true);
            // openDialog(true);
            // navigation.navigate("OrderScreen", {
            //   productID: route.params.data.productID,
            //   authKey: auth,
            //   Email: email,
            //   quantity: quantityC,
            // });
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              fontWeight: 600,
              color: "white",
            }}
          >
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
    // display:flex,
    flexDirection: "column",
  },
});

export default OrderPage;

import React from "react";
import { BackHandler, StatusBar, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import moment from "moment/moment";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import ProItem from "./ProItem";
import PlaceOrderItem from "./PlaceOrderItem";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext";
import Loading from "./Loading";

// TODO: Start from this page

const OrderPage = ({ route }) => {
  const navigation = useNavigation();
  const [Product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [quantityC, setQuantityC] = useState(1);
  const isDark = useTheme();
  const [Address, setAddress] = useState("");

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
        // console.log(da[0]);
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
        "https://ebuy-backend.onrender.com" + "/auth/address",
        {
          UserEmail: route.params.Email,
          authKey: route.params.authKey,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103) {
          setAddress(da.address);
          console.log(da.address);
          setIsAddressLoading(false);
        } else {
          console.log("Failed to get Address" + da.status);
        }
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
    getAddress();

    navigation.addListener("focus", () => {
      console.log("Address refreshed");
      getAddress();
    });

    const bacHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => bacHandler.remove();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={isDark ? "black" : "white"}
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            paddingHorizontal: 10,
            paddingVertical: 20,
            backgroundColor: "white",
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

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            // height: "20%",
            borderRadius: 10,
            marginHorizontal: 5,
            backgroundColor: "white",
            marginTop: 7,
            paddingVertical: 10,
          }}
        >
          {isAddressLoading ? (
            <Loading />
          ) : (
            <View>
              {Address.length == 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AddAddressScreen", {
                      authKey: route.params.authKey,
                      Email: route.params.Email,
                    });
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="plus" size={12} style={{ marginRight: 5 }} />
                    <Text style={{}}>Add Address</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon2 name="location" size={20} style={{ margin: 20 }} />
                  <View style={{ flex: 1 }}>
                    <Text size={15} style={{ fontWeight: 600 }}>
                      {Address.address}
                    </Text>
                    <Text
                      style={{ fontSize: 12, fontWeight: 600, color: "grey" }}
                    >
                      {Address.name}
                    </Text>
                    <Text
                      style={{ fontSize: 12, fontWeight: 600, color: "grey" }}
                    >
                      {Address.number}
                    </Text>
                  </View>
                  <Icon2
                    name="chevron-small-right"
                    size={20}
                    style={{ margin: 15 }}
                  />
                </View>
              )}
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: "white",
            marginTop: 20,
            padding: 10,
            borderRadius: 10,
            marginHorizontal: 5,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
            Order Summery
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Product Price </Text>
            <Text>LKR: {Product.productPrice * quantityC}</Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>After Discount </Text>
            <Text>
              - LKR:{" "}
              {(
                ((Product.productPrice * Product.discountPercentage) / 100) *
                quantityC
              ).toFixed(2)}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Delivery Charges </Text>
            <Text>LKR: {500}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Total Price </Text>
            <Text>
              LKR:{" "}
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
      <View
        style={{ height: "10%", flexDirection: "row", alignItems: "center" }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
            {"LKR : " +
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
            backgroundColor: "#7c0a0a",
            flex: 1,
            justifyContent: "center",
            borderRadius: 5,
            margin: 5,
            height: 40,
          }}
          onPress={async () => {
            Alert.alert("Order Processing", "Please wait a moment");
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
    // backgroundColor:'white',
    // display:flex,
    flexDirection: "column",
  },
});

export default OrderPage;

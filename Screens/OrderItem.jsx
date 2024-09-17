import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BaseUrl } from "../Utils/Constrains";
import { useNavigation } from "@react-navigation/native";

const OrderItem = ({ order }) => {
    const navigation=useNavigation();
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProduct = () => {
    axios
      .get(
        BaseUrl + "/api/products",
        {
          params: { ReqType: "byid", productID: order.productID },
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
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);
  return (
    <TouchableOpacity style={{ backgroundColor: "white", marginVertical: 5, padding: 7 }}
    onPress={()=>{
        navigation.navigate("OrderDetails",{order:order,product:product});
    }}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontSize:13}}>Order Id:<Text style={{fontWeight:500}}>{order.orderID}</Text></Text>
        
      <Text style={{color: "blue" }}>
        {order.isCancled?"Canceled":
        order.orderStatus == -1
          ? "Processing"
          : order.orderStatus == 0
            ? "Shipped"
            : "Delivered"}
      </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 5,
          backgroundColor: "#EFEFEF",
          borderRadius: 10,
        }}
      >
        <Image
          source={{ uri: product.thumbnail }}
          style={{ height: 75, aspectRatio: 1, marginRight: 5 }}
        />
        <Text>{product.productTitle}</Text>
      </View>
      <View
        style={{
          marginLeft: 75,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: 600 }}>LKR. {order.productPrice}</Text>
        <Text style={{ fontWeight: 600 }}>Qty:{order.productQuantity}</Text>
      </View>
      <Text
        style={{
          fontSize: 17,
          fontWeight: 600,
          alignSelf: "flex-end",
          marginVertical: 15,
        }}
      >
        Total Price: {order.totalPrice}
      </Text>
      {order.orderStatus == -1 && !order.isCancled? (
        <TouchableOpacity
          style={{
            backgroundColor: "#CE000A",
            padding: 10,
            borderRadius: 10,
            width: "40%",
            alignItems: "center",
            alignSelf: "flex-end",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontWeight: 600, color: "white" }}>Cancel</Text>
        </TouchableOpacity>
      ) : order.orderStatus == 1 ? (
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderColor:'black',
            borderWidth:1,
            padding: 10,
            borderRadius: 10,
            width: "40%",
            alignItems: "center",
            alignSelf: "flex-end",
            marginBottom: 5,
            elevation:3
          }}
          onPress={()=>navigation.navigate("OrderReview",{order:order,product:product})}
        >
          <Text style={{ fontWeight: 600, color: "black" }}>Review</Text>
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default OrderItem;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { BaseUrl, Red } from "../Utils/Constrains";
import { useNavigation } from "@react-navigation/native";
import Swal from "sweetalert2";
import ModAlert from "../Utils/ModAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderItem = ({ order }) => {
    const navigation=useNavigation();
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShow,setIsShow]=useState(false);


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

  const getAuthToken = async () => {
    setIsLoading(true)
    await AsyncStorage.getItem("AUTH_TOKEN").then(async (a) => {
      await AsyncStorage.getItem("USER_EMAIL").then(async (e) => {
        cancelOrder(e, a);
      });
    });
  };

  const cancelOrder = (e, a) => {
    axios
      .post(
        BaseUrl + "/orders/cancle",
        {
          UserEmail: e,
          authKey: a,
          orderID: order.orderID,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        setIsShow(false)
        if (da.status == 103) {
          console.log(da.msg);
          setIsLoading(false);
        } else {
          console.log("Failed to cancel the order" + da.status);
        }
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
          // source={{ uri: product.thumbnail }}
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
          onPress={()=>setIsShow(true)}
        >
          <Text style={{ fontWeight: 600, color: "white" }}>Cancel</Text>
        </TouchableOpacity>
      ) : order.orderStatus == 1 && !order.reviewStatus ? (

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
      <Modal transparent animationType="fade" visible={isShow}>
        <TouchableOpacity
          onPress={() => {
            setIsShow(false);
          }}
          style={{
            flex: 1,
            backgroundColor: "#000000AA",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            style={
              {
                // width: "100%",
              }
            }
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                width: "90%",
                padding: 10,
                maxHeight: "40%",
                // justifyContent: "space-around",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: 600, fontSize: 17, marginBottom: 30 }}>
                Confirm Action
              </Text>
              <Text
                style={{ fontSize: 16, alignSelf: "center", marginBottom: 40 }}
              >
                Do you want to cancel this order
              </Text>

              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: Red,
                    borderRadius: 10,
                    padding: 10,
                    width: "40%",
                    alignItems: "center",
                    alignSelf: "flex-end",
                  }}
                  onPress={() => getAuthToken()}
                >
                  <Text style={{ color: "white" }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    width: "40%",
                    alignItems: "center",
                    alignSelf: "flex-end",
                  }}
                  onPress={() => setIsShow(false)}
                >
                  <Text style={{}}>Keep</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({});

export default OrderItem;

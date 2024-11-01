import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Entypo";
import formatDistance from "date-fns/formatDistance";
import { BaseUrl, Red } from "../Utils/Constrains";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Utils/Loading";


const OrderDetails = ({ route }) => {
  const navigation = useNavigation();

  const { order, product } = route.params;
  const [isModalOpened, setIsModalOpened] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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



  return (
    isLoading?<View style={{flex:1}}><Loading/></View>:
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingBottom: 7,
          elevation: 1,
          alignItems: "flex-end",
        }}
      >
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
            textAlign: "center",
            fontWeight: 600,
            flex: 1,
          }}
        >
          Order Details
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 600 }}>
            {order.isCancled
              ? "Order has being canceled"
              : order.orderStatus == -1
                ? "Order is Processing"
                : order.orderStatus == 0
                  ? "Order is on the way"
                  : order.orderStatus == 1
                    ? "Order Delivered"
                    : ""}
          </Text>

          {order.isCancled ? (
            <Text>Order has being canceled</Text>
          ) : (
            <Text style={{ marginTop: 10, color: "grey" }}>
              Paid by {order.shippingMethod=1?"Card":"COD"},
              {order.orderStatus == -1
                ? "Your order is Processing,it will shipped within 1-3 working days"
                : order.orderStatus == 0
                  ? "Your order is on the way,it will arraived within 1-5 working days"
                  : order.orderStatus == 1
                    ? "Your order Delivered,see you in next order"
                    : ""}
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
            Order details
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text>Order Id</Text>
            <Text>{order.orderID}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text>Ordered on </Text>
            <Text>{new Date(order.orderDate).toLocaleDateString()}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text>
              Paid by (
              {order.shippingMethod=1?"Card":"Cash on delivery"})
            </Text>
            <Text>LKR.{order.shippingCost}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text style={{color:'black',fontWeight:600}}>
             Tracking number
            </Text>
            <Text style={{color:'black',fontWeight:600}}>{order.trackingNumber}</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Address</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: 600 }}>
              {order.orderAddress[0].first_name+" "+order.orderAddress[0].last_name}
            </Text>
            <Text>{order.orderAddress[0].number}</Text>
          </View>
          <Text>{order.orderAddress[0].address}</Text>
          <Text>{order.orderAddress[0].city}</Text>
          <Text>{order.orderAddress[0].province}</Text>
          <Text>{order.orderAddress[0].zipcode}</Text>
          <Text>{order.orderAddress[0].land_marks}</Text>
        </View>
        <View style={{ backgroundColor: "white", padding: 7 }}>
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
            <Text style={{}}>{product.productTitle}</Text>
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
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
            Order Summery
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text>Subtotal</Text>
            <Text>LKR.{order.productPrice * order.productQuantity}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text>Discounts</Text>
            <Text>
              - LKR.
              {(order.productPrice / 100) *
                order.productDiscount *
                order.productQuantity}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text>Delivery fee</Text>
            <Text> LKR.{order.shippingCost}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 600 }}>Total</Text>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              LKR.{order.totalPrice}
            </Text>
          </View>
        </View>
        {order.orderStatus == -1 && !order.isCancled ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#CE000A",
              padding: 10,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 5,
            }}
            onPress={() => setIsModalOpened(true)}
          >
            <Text style={{ fontWeight: 600, color: "white" }}>Cancel</Text>
          </TouchableOpacity>
        ) : order.orderStatus == 1 ? (
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 5,
              elevation: 3,
            }}
            onPress={() => setIsModalOpened(true)}
          >
            <Text style={{ fontWeight: 600, color: "black" }}>Review</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </ScrollView>
      <Modal transparent animationType="fade" visible={isModalOpened}>
        <TouchableOpacity
          onPress={() => {
            setIsModalOpened(false);
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
                  onPress={() => setIsModalOpened(false)}
                >
                  <Text style={{}}>Keep</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default OrderDetails;

import { View, Text, Alert } from "react-native";
import React from "react";
import { Image } from "react-native";
import Icon2 from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { BaseUrl } from "../Utils/Constrains";

export default function CartItem({
  product,
  index,
  qty,
  reFreshStat,
  auth,
  email,
}) {
  const deleteCar = async (pID) => {
    axios
      .delete(
        BaseUrl + "/auth/cart",

        {
          data: {
            UserEmail: email,
            authKey: auth,
            productID: pID,
          },
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103 && da.msg == "Delete Success") {
          reFreshStat(true);
        } else {
          console.log("Failed to update" + da.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",

        padding: 10,
        marginBottom: 5,
      }}
    >
      <Icon
        style={{ alignSelf: "flex-end", marginHorizontal: 5 }}
        name="trash"
        size={20}
        color="black"
        onPress={() => {
          deleteCar(product.productID);
        }}
      />
      <View
        style={{ borderBottomWidth: 1, flexDirection: "row", paddingBottom: 5 }}
      >
        <Image
          height={100}
          width={undefined}
          style={{ aspectRatio: 1 }}
          source={{ uri: product.thumbnail }}
        />

        <View
          style={{
            flex: 1,
            marginLeft: 5,
            justifyContent: "space-between",
            paddingLeft: 5,
          }}
        >
          <View style={{ flex: 1, justifyContent: "space-around" }}>
            <Text>{product.productTitle}</Text>
            <Text>
              {product.productPrice}x{qty.QTY}
            </Text>
            {/* <Text>x{qty[index].QTY}</Text> */}
          </View>

          <View style={{ padding: 10,flexDirection:'row',width:'100%',textAlign:'right' ,alignItems:'center',justifyContent:'flex-end'}}>
            <Text style={{ textAlign: "right", fontSize: 15, fontWeight: 500,color:'grey' ,textDecorationLine: 'line-through', textDecorationStyle: 'solid',marginRight:5}} >
              LKR:
              {product.productPrice * qty.QTY}
            </Text>
            <Text style={{ textAlign: "right", fontSize: 20, fontWeight: 500 }}>
              LKR:
              {((product.productPrice * (100 - product.discountPercentage)) /
                100) *
                qty.QTY}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

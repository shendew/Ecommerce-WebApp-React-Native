import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import pIMG from "../img/p2.jpg";
import addCart from "../img/addtocart.png";
import { scale } from "react-native-size-matters";

import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export default function ProItem({ data }) {
  const navigation=useNavigation();
  return (
    data.productID==null?<View style={{backgroundColor: 'rgba(52, 52, 52)'}}></View>:
      <TouchableOpacity key={data.productID} style={{ backgroundColor: "#ffffff",borderRadius: 15,}} onPress={() => {
        navigation.push("ProductView", { data: data });
      }}>
        <Image
          source={{ uri: data.thumbnail }}
          style={{
            
            borderRadius: 15,
            height: undefined,
            aspectRatio: 1,
          }}
        />
        <Text style={{ width: "100%", marginHorizontal: 5 }}>
          {data.productTitle}
        </Text>
        {/* <Image source={addCart} style={styles.proAddC}/> */}
        <Text style={{ color: "#00000", fontWeight: 600, margin: 10 }}>
          {"LKR : " +
            (
              (data.productPrice * (100 - data.discountPercentage)) /
              100
            ).toFixed(2)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              color: "#00000",
              fontSize: 11,
              fontWeight: 600,
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
              textDecorationColor: "#ff0000",
              color: "#d3d3d3",
            }}
          >
            {"LKR :" + data.productPrice.toFixed(2) + "   "}
          </Text>
          <Text style={{ color: "#00000", fontSize: 11, fontWeight: 600 }}>
            {data.discountPercentage + "% OFF"}
          </Text>
        </View>
        
      </TouchableOpacity>    
  );
}

const styles = StyleSheet.create({
  productContainer: {
    width: "48%",
    // height:'21%',
    // width:175,
    height: 300,
    borderWidth: 0.7,
    borderColor: "#696969",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addC: {
    alignSelf: "flex-end",
    top: "-81%",
    right: "3%",
    height: 25,
    width: 25,
    resizeMode: "cover",
  },
  proTitle: {
    paddingHorizontal: 5,
  },
  proPrice: {
    paddingHorizontal: 5,
    fontSize: 17,
    marginBottom: 5,
    fontWeight: "600",
    color: "#c90000",
  },
});

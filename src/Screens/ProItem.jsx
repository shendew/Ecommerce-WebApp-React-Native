import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import pIMG from "../img/p2.jpg";
import addCart from "../img/addtocart.png";
import { scale } from "react-native-size-matters";

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useState } from "react";
import { Rating } from "react-native-ratings";
const { width, height } = Dimensions.get("window");

export default function ProItem({ data }) {
  const [ratings,setRatings] =useState(0);
  const navigation=useNavigation();

  const calcRatings=()=>{

    if(data.reviews){
      var rat=0;
      const itemC=data.reviews.length;
      if(!data.reviews||itemC==0){
        setRatings(0)
      }else{
        data.reviews.map((value, index, array) => {
        rat=rat+value.Rating;
      })
      
        setRatings(rat/itemC)
      
      
      }
    }else{
      setRatings(0)
    }
    
      
    
    
  }

  useEffect(() => {
    calcRatings();
    console.log(data.productTitle)
  }, []);

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
        <Text style={{ width: "100%", marginHorizontal: 5 ,marginBottom:5,color:'black'}}>
          {data.productTitle}
        </Text>
        {
          ratings==0?<></>:
          <Rating
                readonly
                ratingCount={5}
                imageSize={10}
                fractions={1}
                startingValue={ratings}
                style={{ marginBottom: 10 ,alignSelf:'flex-start',marginLeft:10}}
              />
        }
        
        {/* <Image source={addCart} style={styles.proAddC}/> */}
        <Text style={{ color: "black", fontWeight: 600, marginBottom: 10,marginHorizontal:10 }}>
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

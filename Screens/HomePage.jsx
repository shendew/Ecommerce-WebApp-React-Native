import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./ProductItem";
import { SliderBox } from "react-native-image-slider-box";
const sliderData = require("../jsonData/Sliders.json");
const Products = require("../jsonData/Products.json");
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

export const SliderItem = {
  title: String,
  img: String,
  desc: String,
};

export default function HomePage() {
  const FlatRef = useRef();
  const [searchTxt, setSearchTxt] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      if (currentIndex === sliderData.length - 1) {
        FlatRef.current.scrollToIndex({
          index: 0,
          animation: true,
        });
      } else {
        FlatRef.current.scrollToIndex({
          index: currentIndex + 1,
          animation: true,
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  });

  const getItemLayout = (data, index) => ({
    length: width,
    offset: (width) * index,
    index: index,
  });

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / (width);
    setCurrentIndex(Math.round(index));
  };

  const renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ position: "relative", height: 300 , width:width}}
        key={item}
      >
        <Image
          source={{ uri: item.sliderIMG }}
          style={{ width:width, height: 300, backgroundColor: "red"}}
        />
        <LinearGradient
          style={{ position: "absolute", width:width, height: 300 }}
          colors={["transparent", "rgba(0,0,0,0.8)"]}
        >
          <View
            style={{
              position: "absolute",
              width: width,
              height: 250,
              flexDirection: "column-reverse",
              alignItems: "flex-start",
              padding: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                alignSelf: "baseline",
              }}
            >
              {item.sliderTitle}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      {/* <View style={styles.toolBar}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Icon style={styles.topIcons} name="car" size={30} color="#000" />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: 900 }}>E-Buy - LK</Text> */}
          {/* <Image source={require('../img/logo.png')} style={{width:50, height:50, marginHorizontal: 'auto'}}/> */}
        {/* </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Icon style={styles.topIcons} name="bars" size={30} color="#000" />
        </View>
      </View> */}
      
      <View style={{ height: height - 50 }}>
        <ScrollView style={{ backgroundColor: "#F3F3F3" }}>
          <View style={{ flexDirection: "column" ,alignItems:"center"}}>
            <View style={{ height: 300, width:width}}>
              <FlatList
              style={{ backgroundColor: "black", height: 300 ,width:width}}
              data={sliderData}
              renderItem={renderItems}
              keyExtractor={(item, index) => {
                item.id;
              }}
              horizontal
              scrollEnabled
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              ref={FlatRef}
              onScroll={handleScroll}
              getItemLayout={getItemLayout}
            />
            </View>
            
            <View
              style={{
                height: 275,
                width: width,
                position: "absolute",
                flexDirection: "column-reverse",
                alignItems: "baseline",
                
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  position: "absolute",
                  flexDirection: "row",
                }}
              >
                {sliderData.map((dot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      {
                        width: 10,
                        height: 10,
                        backgroundColor: "red",
                        borderRadius: 50,
                        marginHorizontal: 5,
                      },
                      {
                        backgroundColor:
                          index == currentIndex ? "black" : "gray",
                      },
                    ]}
                  ></TouchableOpacity>
                ))}
              </View>
            </View>

            <View
              style={{
                // flex:1,
                // height: 500,
                flexDirection: "row",
                padding: 10,
                flexWrap: "wrap",
                justifyContent: "space-around",
                // backgroundColor: "yellow",
              }}
            >
              {Products.map((product) => (
                <ProductItem
                  productID={product.productID}
                  productTitle={product.productTitle}
                  productDescription={product.productDescription}
                  productPrice={product.productPrice}
                  discountPercentage={product.discountPercentage}
                  rating={product.rating}
                  stock={product.stock}
                  brand={product.brand}
                  category={product.category}
                  thumbnail={product.thumbnail}
                  images={product.images}
                />
              ))}
            </View>




          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  topIcons: {
    marginLeft: 25,
    right: 0,
  },
  toolBar: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  textInput: {
    display: "none",
    color: "black",
    textAlign: "left",
    placeholderTextColor: "black",
    width: "90%",
    marginBottom: 20,
    borderRadius: 17,
    borderColor: "black",
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 25,
  },
});

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
  Alert,
} from "react-native";
// import { ScrollView } from 'react-native-virtualized-view'
import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./ProductItem";
import { SliderBox } from "react-native-image-slider-box";

const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import HomeCaregoryItem from "./HomeCaregoryItem";
import ProItem from "./ProItem";
import { useNavigation } from "@react-navigation/native";

const sliderData = require("../jsonData/Sliders.json");
const Products = require("../jsonData/Products.json");
const Categories = require("../jsonData/Categories.json");

export const SliderItem = {
  title: String,
  img: String,
  desc: String,
};

export default function HomePage() {
  const navigation = useNavigation();
  const FlatRef = useRef();
  const [searchTxt, setSearchTxt] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {});

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index: index,
  });

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setCurrentIndex(Math.round(index));
  };

  const HomeCateItem = ({ item, index }) => {
    
    const CategoryClick = (item) => {
      navigation.push("CategoryViewPage",{name:item});
    };
    return (
      <TouchableOpacity onPress={() => CategoryClick(item)}>
        <View
          key={item.cateID}
          style={{
            width: 60,
            flexDirection: "column",
            marginHorizontal: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://convenienceworldmagazine.com.au/wp-content/uploads/2020/10/shutterstock_570190258-scaled.jpg",
            }}
            style={{ borderRadius: 25, width: 50, height: 50 }}
          />
          <Text style={{ fontSize: 11, marginTop: 5 }}>{item.cateTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View style={{ height: height - 50 }}>
        <ScrollView style={{ backgroundColor: "#F3F3F3" }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TextInput
              style={styles.searchBox}
              placeholder="Search any Product.."
              placeholderTextColor={"gray"}
              onChangeText={setSearchTxt}
              value={searchTxt}
            />

            <Text
              style={{
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 700,
                width: "93%",
              }}
            >
              All Featured
            </Text>

            <ScrollView
              horizontal={true}
              style={{
                marginBottom: 10,
                borderRadius: 10,
                marginHorizontal: 7,
              }}
            >
              <View style={{ flexDirection: "row", paddingVertical: 5 }}>
                <FlatList
                  data={Categories}
                  renderItem={HomeCateItem}
                  scrollEnabled
                  horizontal
                />
              </View>
            </ScrollView>

            <View style={{ height: 300, width: width }}></View>
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
              <FlatList
                data={Products}
                renderItem={ProItem}
                numColumns={2}
                scrollEnabled
              />
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
  searchBox: {
    padding: 10,
    textAlign: "left",
    backgroundColor: "white",
    width: "93%",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  homeTitle: {},
});

import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Animated,
  StyleSheet,
  TextInput,
  Alert,
  ImageBackground,
  Button,
} from "react-native";
// import { ScrollView } from 'react-native-virtualized-view'
import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./ProductItem";
import { SliderBox } from "react-native-image-slider-box";

const { width, height } = Dimensions.get("window");
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

const cardWidth = (width / 2.7) * 2;
const gap = (width - cardWidth) / 7;
const offset = cardWidth;

export default function HomePage() {
  const navigation = useNavigation();
  const FlatRef = useRef();
  const [searchTxt, setSearchTxt] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(1)).current;

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
      navigation.push("CategoryViewPage", { name: item });
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
              placeholderTextColor={"#606060"}
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

            <View style={{ height: 300, width: width }}>
              <ScrollView
                contentContainerStyle={styles.container}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  {
                    useNativeDriver: false,
                  }
                )}
              >
                {sliderData.map((e, i) => (
                  <Item key={e} scrollX={scrollX} i={i} />
                ))}
              </ScrollView>
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
              <FlatList
                data={Products}
                renderItem={ProItem}
                numColumns={2}
                scrollEnabled
                ItemSeparatorComponent={() => <View style={{height: 20}} />}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const Item = ({ i, scrollX }) => {
  const scale = scrollX.interpolate({
    inputRange: [-offset + i * offset, offset * i, offset + i * offset],
    outputRange: [0.9, 1.1, 0.9],
  });
  return (
    <Animated.View
      key={i}
      style={[styles.item, { transform: [{ scale: scale }] ,position:'relative'}]}
    >
      <Image
        source={{ uri: sliderData[i].sliderIMG }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%", borderRadius: 10 ,position:'absolute'}}
      />
      <View style={{position:'absolute', width:'100%', height:'100%',justifyContent:'space-around',paddingTop:"20%",alignContent:'flex-start',padding:5,flexDirection:'column'}}>
      <Text style={[styles.text,{color:'#ffffff',width:"50%"}]}>{sliderData[i].sliderTitle}</Text>
      <Text style={{color:'#ffffff',width:"35%",fontSize:10}}>{"Card :" + sliderData[i].sliderTitle}</Text>
      <TouchableOpacity  color={"#bb0000"}  width='35%' ><View style={{padding:5,borderRadius:5,borderColor:'#ffffff',borderWidth:1,width:'30%',justifyContent:'center',alignItems:'center'}}><Text style={{color:'#ffffff',fontSize:11,fontWeight:600}}>Shop Now</Text></View></TouchableOpacity>

      </View>
    </Animated.View>
  );
};

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
    backgroundColor: "#ffffff",
  },
  textInput: {
    display: "none",
    color: "#00000",
    textAlign: "left",
    placeholderTextColor: "#00000",
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
    backgroundColor: "#ffffff",
    width: "93%",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  homeTitle: {},

  container: { flexDirection: "row", alignItems: "center" },
  item: {
    backgroundColor: "#bb0000",
    width: cardWidth,
    height: cardWidth / 1.3,
    marginHorizontal: gap,
    borderRadius: 10,
  },
  text: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#fff" ,
    textAlign:'left'
    
  },
    
});

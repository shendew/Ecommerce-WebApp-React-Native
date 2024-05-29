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
  StatusBar,
} from "react-native";
import Icon2 from "react-native-vector-icons/Feather";
import React, { useEffect, useRef, useState } from "react";
const { width, height } = Dimensions.get("window");
import ProItem from "./ProItem";
import { useNavigation } from "@react-navigation/native";
import { useUpdateAuth } from "./AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, useUpdateTheme } from "./ThemeContext";

// import Categories from '../jsonData/Categories.json';

export const SliderItem = {
  title: String,
  img: String,
  desc: String,
};

const cardWidth = (width / 2.7) * 2;
const gap = (width - cardWidth) / 7;
const offset = cardWidth;

export default function HomePage() {
  const [Products, setProducts] = useState([]);
  const [Sliders, setSliders] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");


  const navigation = useNavigation();
  const authHandler = useUpdateAuth();
  const isDark=useTheme();
  // const [isDark,setIsDark]=useState(false);
  const themeHandler=useUpdateTheme();


  const scrollX = useRef(new Animated.Value(1)).current;

  const getProducts = async () => {
    axios
      .get("https://ebuy-sl.netlify.app/.netlify/functions/api/products")
      .then(function (response) {
        const da=response.data;
        if(da.length%2==1){
          const it={
          "productID": null,
          "productTitle": "Pepsi - 1.50 l",
          "productDescription": "Pepsi-the bold, refreshing, robust cola *Images for illustration purposes only. Product received may vary.",
          "productPrice": 400,
          "discountPercentage": 25,
          "rating": 4.69,
          "stock": 94,
          "brand": "Pepsi",
          "category": "Beverages",
          "thumbnail": "https://cargillsonline.com/VendorItems/MenuItems/BV91207_1.jpg",
          "images": ["https://cargillsonline.com/VendorItems/MenuItems/BV91207_1.jpg", "https://cargillsonline.com/VendorItems/MenuItems/BV91207_2.jpg"]
        };
        const UpdatedArray=[...da,it];
          setProducts(UpdatedArray)
        }else{
          setProducts(da)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getSliders = async () => {
    axios
      .get("https://ebuy-sl.netlify.app/.netlify/functions/api/sliders")
      .then((response) => {
        setSliders(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCategires = async () => {
    axios
      .get("https://ebuy-sl.netlify.app/.netlify/functions/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProducts();
    getCategires();
    getSliders();

    
  }, []);

  const HomeCateItem = ({ item, index }) => {
    const CategoryClick = (item) => {
      navigation.push("CategoryViewPage", { data: item });
    };
    return (
      <TouchableOpacity key={item.cateID} onPress={() => CategoryClick(item)}>
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
      <StatusBar backgroundColor={isDark?"black":"white"} barStyle={isDark?"light-content":"dark-content"} />
      <View style={{}}>
        <ScrollView style={{ backgroundColor: isDark?"black":"#F3F3F3" ,color:isDark?"white":"black"}}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TextInput
              style={styles.searchBox}
              placeholder="Search any Product.."
              placeholderTextColor={"#606060"}
              onChangeText={setSearchTxt}
              value={searchTxt}
              // onFocus={()=>{navigation.push("SearchScreens",{txt:searchTxt})}}
              returnKeyType="search"
              onSubmitEditing={() => {
                navigation.push("SearchScreens", { text: searchTxt });
              }}
            />

            <Text
              style={{
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 700,
                width: "93%",
                color:isDark?"white":"black",
              }}
              onPress={() => {

          //update login

                AsyncStorage.removeItem("AUTH_TOKEN")
                  .then(() => {
                    console.log("Token removed successfully");
                    authHandler(false);
                  })
                  .catch((error) => {
                    Alert.alert("Please try again later.");
                    console.error("Error removing token:", error);
                  });

          //update theme
                // themeHandler(!isDark)
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
                {Sliders.map((e, i) => (
                  <Item key={i} scrollX={scrollX} i={i} Sliders={Sliders} />
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              <FlatList
                data={Products}
                renderItem={({ item }) => {
                  return (
                    <View
                      key={item.productID}
                      style={{
                        flexGrow: 1,
                        width: width/2.5,
                        marginHorizontal: 5,
                      }}
                    >
                      <ProItem data={item} />
                    </View>
                  );
                }}
                numColumns={2}
                columnWrapperStyle={{flex: 1,justifyContent: "space-around"}}
                scrollEnabled
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const Item = ({ i, scrollX, Sliders }) => {
  const scale = scrollX.interpolate({
    inputRange: [-offset + i * offset, offset * i, offset + i * offset],
    outputRange: [0.9, 1.1, 0.9],
  });
  return (
    <Animated.View
      key={i}
      style={[
        styles.item,
        { transform: [{ scale: scale }], position: "relative" },
      ]}
    >
      <Image
        source={{ uri: Sliders[i].sliderIMG }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 10,
          position: "absolute",
        }}
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "space-around",
          paddingTop: "20%",
          alignContent: "flex-start",
          padding: 5,
          flexDirection: "column",
        }}
      >
        <Text style={[styles.text, { color: "#ffffff", width: "50%" }]}>
          {Sliders[i].sliderTitle}
        </Text>
        <Text style={{ color: "#ffffff", width: "35%", fontSize: 10 }}>
          {"Card :" + Sliders[i].sliderTitle}
        </Text>
        <TouchableOpacity color={"#bb0000"} width="35%">
          <View
            style={{
              padding: 5,
              borderRadius: 5,
              borderColor: "#ffffff",
              borderWidth: 1,
              width: "30%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: 600 }}>
              Shop Now
            </Text>
          </View>
        </TouchableOpacity>
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
    color: "#fff",
    textAlign: "left",
  },
});

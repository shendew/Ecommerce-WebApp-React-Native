import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import ProItem from "./ProItem";
import axios from "axios";

const SearchScreen = ({ route }) => {
  const [searchTxt, setSearchTxt] = useState(text);
  const [Products, setProducts] = useState([]);
  const navigation = useNavigation();
  const { text } = route.params;


  const getProducts = async (sText) => {
    axios
      .get("https://ebuy-sl-39c4d4a9e148.herokuapp.com/api/products",{params:{q:sText}})
      .then(function (response) {
        setProducts(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    setSearchTxt(text);
    getProducts(text);
  }, []);

  const handleSearch = (txt) => {
    setSearchTxt(txt);
  };



  return (
    <SafeAreaView>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
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
          Search
        </Text>
        {/* <Icon2 name="shopping-cart" size={30} color="black" onPress={()=>{navigation.push("MyCart")}}/> */}
      </View>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search any Product.."
          placeholderTextColor={"#606060"}
          onChangeText={(txt) => handleSearch(txt)}
          value={searchTxt}
        />
      </View>
      <FlatList
        style={{height:'100%'}}
        data={Products}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.productID}
              onPress={() => {
                navigation.push("ProductView", { data: item });
              }}
              style={{
                flexGrow: 1,
                width: "40%",
                backgroundColor: "#ffffff",
                marginHorizontal: 5,
                borderRadius: 15,
              }}
            >
              <ProItem data={item} />
            </TouchableOpacity>
          );
        }}
        numColumns={2}
        scrollEnabled
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default SearchScreen;

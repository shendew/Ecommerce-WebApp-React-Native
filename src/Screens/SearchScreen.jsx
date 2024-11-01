import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import debounce from "lodash.debounce";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import ProItem from "./ProItem";
import axios from "axios";
import { BaseUrl } from "../Utils/Constrains";
import Loading from "../Utils/Loading";
const { width, height } = Dimensions.get("window");

const SearchScreen = ({ route }) => {
  const [searchTxt, setSearchTxt] = useState(text);
  const [Products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { text } = route.params;

  const getProducts = async (sText) => {
    console.log("got")
    setIsLoading(true);
    axios
      .get(BaseUrl + "/api/search", { params: { keyword: sText } })
      .then(function (response) {
        // console.log(response.data.value[0].productTitle);
        setProducts(response.data.value);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    setSearchTxt(text);
    getProducts(text);
    console.log("refreshed")
  }, []);

  const updateQ=()=>{
    getProducts(searchTxt);
  }

  const debounceText = debounce(updateQ,200);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      </View>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search any Product.."
          placeholderTextColor={"#606060"}
          onChangeText={(txt)=>{
            
            

            setSearchTxt(txt);
            
            debounceText()
          }
        }
          value={searchTxt}
        />
      </View>

      <View
        style={{
          alignSelf: "center",
          width: "95%",
          paddingBottom: 50,
          marginTop: 10,
        }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={Products}
            renderItem={({ item }) => {
              return (
                <View
                  key={item.productID}
                  style={{
                    flex: 1 / 2,
                    // flexGrow: 1,
                    width: width / 2.5,
                    marginHorizontal: 5,
                  }}
                >
                  <ProItem data={item} />
                </View>
              );
            }}
            numColumns={2}
            // columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
            scrollEnabled
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
      </View>
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

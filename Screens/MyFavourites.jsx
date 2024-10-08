import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProItem from "./ProItem";

// import SliderBox from 'react-native-image-slider-box';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
const { width, height } = Dimensions.get("window");
import axios from "axios";
import Loading from "./Loading";
import { BaseUrl } from "../Utils/Constrains";

const MyFavourites = () => {
  const navigation = useNavigation();
  const [Products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = async () => {
    setIsLoading(true);
    axios
      .get(BaseUrl + "/api/products", {
        params: {
          ReqType: "all",
        },
      })
      .then(function (response) {
        setIsLoading(false);
        const da = response.data.value;
        if (da.length % 2 == 1) {
          const it = {
            productID: null,
            productTitle: "Pepsi - 1.50 l",
            productDescription:
              "Pepsi-the bold, refreshing, robust cola *Images for illustration purposes only. Product received may vary.",
            productPrice: 400,
            discountPercentage: 25,
            rating: 4.69,
            stock: 94,
            brand: "Pepsi",
            category: "Beverages",
            thumbnail:
              "https://cargillsonline.com/VendorItems/MenuItems/BV91207_1.jpg",
            images: [
              "https://cargillsonline.com/VendorItems/MenuItems/BV91207_1.jpg",
              "https://cargillsonline.com/VendorItems/MenuItems/BV91207_2.jpg",
            ],
          };
          const UpdatedArray = [...da, it];
          setProducts(UpdatedArray);
        } else {
          setProducts(da);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
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
          My Favourites
        </Text>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView style={{ width: "100%" }}>
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
              renderItem={({ item }) => {
                return (
                  <View
                    key={item.productID}
                    style={{
                      flexGrow: 1,
                      width: width / 2.5,
                      marginHorizontal: 5,
                    }}
                  >
                    <ProItem data={item} />
                  </View>
                );
              }}
              numColumns={2}
              scrollEnabled
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({})

export default MyFavourites;

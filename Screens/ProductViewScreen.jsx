import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";
import { useState } from "react";
import Loading from "./Loading";
import { Dialog } from "react-native-elements";
import { BlurView } from "expo-blur";
import { useEffect } from "react";


// TODO: Add reviews

function ProductViewScreen({ route }) {
  const [auth, setAuth] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qtyDialog,setQtyDialog] =useState(false);
  const [quantityC,setQuantityC] = useState(1);
  const navigation = useNavigation();

  const getAuthToken = async (type) => {
    await AsyncStorage.getItem("AUTH_TOKEN").then(async (a) => {
       setAuth(a);
      await AsyncStorage.getItem("USER_EMAIL").then(async (e) => {
        
        setEmail(e);
        // if (type == "cart") {
        //   addcar(e, a);
        // } else if (type == "order") {
          
        // }
        
        
        return a;
      });
    });
  };

  const openDialog = () => {
    setQtyDialog(true)
  };

  const addcar = async (e, a) => {
    console.log(e+a)
    axios
      .put(
        "https://ebuy-backend.onrender.com" + "/auth/cart",
        {
          UserEmail: e,
          authKey: a,
          productID: route.params.data.productID,
          QTY: 1,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        setIsLoading(false);
        const da = response.data;
        if (da.status == 103) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Item added to cart",
          });
          console.log("Success");
        } else {
          console.log("Failed to update" + da.status);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(async() => {
    await getAuthToken();
  }, []);

  return (
    <SafeAreaView
      style={{ width: "100%", height: "100%", flexDirection: "column" }}
    >
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      {isLoading ? (
        <Loading />
      ) : (
        <View>
          <View
            style={{
              width: "100%",
              height: "8%",
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingHorizontal: 15,
              paddingBottom: 7,
              elevation: 1,
            }}
          >
            <Icon
              name="angle-left"
              size={30}
              color="black"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Icon2
              name="shopping-cart"
              size={25}
              color="black"
              onPress={() => {
                navigation.navigate("My Cart");
              }}
            />
          </View>
          <ScrollView style={{ paddingTop: 5, height: "85%" }}>
            <Image
              style={{ aspectRatio: 1 }}
              source={{ uri: route.params.data.thumbnail }}
            />
            <View
              style={{
                paddingHorizontal: 5,
                marginTop: 10,
                borderRadius: 1,
                marginHorizontal: 5,
                backgroundColor: "white",
                paddingVertical: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 600 }}>
                {route.params.data.productTitle}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 10,
                  alignItems: "flex-end",
                  marginTop: 10,
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: 600,
                    marginRight: 10,
                    fontSize: 22,
                  }}
                >
                  {"LKR : " +
                    (route.params.data.productPrice *
                      (100 - route.params.data.discountPercentage)) /
                      100}
                </Text>

                <Text
                  style={{
                    color: "#00000",

                    fontWeight: 600,
                    textDecorationLine: "line-through",
                    textDecorationStyle: "solid",
                    textDecorationColor: "#ff0000",
                    color: "#d3d3d3",
                    fontSize: 16,
                  }}
                >
                  {"LKR :" + route.params.data.productPrice + "   "}
                </Text>
                <Text style={{ color: "black", fontSize: 16 }}>
                  {route.params.data.discountPercentage + "% OFF"}
                </Text>
              </View>

              <Text>Product Details</Text>
              <Text style={{ fontSize: 11, marginTop: 15, lineHeight: 16 }}>
                {route.params.data.productDescription}
              </Text>
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: "7%",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                borderRadius: 5,
                margin: 5,
                borderWidth: 1,
              }}
              onPress={async() => {
                await getAuthToken("cart");
                console.log(auth)
                  console.log(email)
                  addcar(email, auth);
                  setIsLoading(true);
                // getAuthToken("cart").then((value) => {
                //   console.log(auth)
                //   console.log(email)
                //   addcar(email, auth);
                //   setIsLoading(true);
                // });
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 15, fontWeight: 600 }}
              >
                Add to Cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#7c0a0a",
                flex: 1,
                justifyContent: "center",
                borderRadius: 5,
                margin: 5,
              }}
              onPress={async() => {
                await getAuthToken("order");
                // setIsLoading(true);
                openDialog(true)
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Buy it now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Toast />
      <Modal
        animationType="fade"
        transparent={true}
        visible={qtyDialog}
        onRequestClose={() => setQtyDialog}
      >
        <BlurView intensity={100} style={{flex:1,alignItems:'center',justifyContent:'center',}}>
          <View style={{backgroundColor:'white',width:'80%',borderRadius:10,padding:10,paddingVertical:20,flexDirection:'column'}}>
          <Text>Select the Quantity</Text>
          <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
          <Icon
              name="minus"
              size={20}
              color="black"
              onPress={() => {
                setQuantityC((old)=>old==1?old:old-1);
              }}
            />
            <Text style={{marginVertical:30,alignSelf:'center'}}>{quantityC}</Text>
            <Icon
              name="plus"
              size={20}
              color="black"
              onPress={() => {
                setQuantityC((old)=> old+1);
              }}
            />
          </View>
          
          <Button title="Buy" onPress={()=>{
            setQtyDialog(false);
            navigation.navigate("OrderScreen", {
              productID: route.params.data.productID,
              authKey: auth,
              Email: email,
              quantity: quantityC,
            });
          }}/>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

export default ProductViewScreen;

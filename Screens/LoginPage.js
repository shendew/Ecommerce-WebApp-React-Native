import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth, useUpdateAuth } from "./AuthContext";
import Toast from "react-native-toast-message";


function LoginPage() {
  const navigation = useNavigation();
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");
  const authHandler = useUpdateAuth();

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

  const checkAUth=async()=>{
    axios
    .post("https://ebuy-sl.netlify.app/.netlify/functions/api/user")
    .then(function (response) {
      const da=response.data;
      
    })
    .catch(function (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong!",
      });
    });
  }


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/loginbacground.png")}
        style={{
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.subContainer}>
          <Image
            source={require("../img/logo.png")}
            style={{ width: "30%", height: "30%" }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: 700,
              marginBottom: 50,
              color: "#000000",
            }}
          >
            Login
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={"#ffffff"}
            onChangeText={onChangeUseremail}
            value={UserEmail}
          />

          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"#ffffff"}
            onChangeText={onChangeUserpassword}
            value={UserPassword}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#eee600",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "90%",
              borderRadius: 25,
              marginBottom: 10,
            }}
            onPress={() => {

              if(UserEmail!="" && UserPassword!=""){
                
              }else{
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: "Fill all fields",
                });
              }

              AsyncStorage.setItem("AUTH_TOKEN", JSON.stringify("test-auth-key"))
                .then(() => {
                  console.log("Token saved successfully");
                  authHandler(true);
                })
                .catch((error) => {
                  Alert.alert("Please try again later.")
                  console.error("Error saving token:", error);
                });
              
            }}
          >
            <Text style={{ textAlign: "center", color: "#000000", fontWeight: 600 }}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: "90%" }}
            onPress={() => navigation.push("SignIn")}
          >
            <Text style={{ fontSize: 12, color: "#7c0a0a" }}>
              Haven't registered yet,
              <Text style={{ fontWeight: 700 }}>Click here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  textInput: {
    color: "#ffffff",
    textAlign: "left",
    width: "90%",
    marginBottom: 20,
    borderRadius: 17,
    borderColor: "#ffffff",
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 25,
  },
  subContainer: {
    backgroundColor: "#ffffff",
    opacity: 0.7,
    width: "90%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});

export default LoginPage;

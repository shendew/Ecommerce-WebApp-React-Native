import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BaseUrl, Red } from "../Utils/Constrains";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useUpdateAuth } from "../Context/AuthContext";
import Loading from "../Utils/Loading";


const UserProfile = () => {
  const authHandler = useUpdateAuth();
  const [auth, setAuth] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);



  const navigation = useNavigation();

  const getAuthToken = async (type) => {
    await AsyncStorage.getItem("AUTH_TOKEN").then(async (a) => {
      setAuth(a);
      await AsyncStorage.getItem("USER_EMAIL").then(async (e) => {
        setEmail(e);
        await getUser(a, e);
        await getPrendingReviews(e);
      });
    });
  };

  const getPrendingReviews=async(e)=>{
    axios
      .get(
        BaseUrl + "/orders/revcount",
        {
          params:{UserEmail: e}
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103) {
          setReviewCount(da.count)
          if(user){
            setIsLoading(false)
          }
        } else {
          console.log("Failed to get Review Count" + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getUser = async (a, e) => {
    axios
      .post(
        BaseUrl + "/auth/user",
        {
          UserEmail: e,
          authKey: a,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103) {
          setUser(da.value);
          if(reviewCount){
            setIsLoading(false)
          }
        } else {
          console.log("Failed to get User" + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getAuthToken();
    });
    getAuthToken();
  }, []);

  return (
    isLoading?<View style={{flex:1}}><Loading/></View>:
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "white", borderRadius: 15, padding: 10 }}>
        {/* top Profile */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{}}>
            <Image
              source={{ uri: user.UserImage }}
              style={{ height: 70, aspectRatio: 1, borderRadius: 100 }}
            />
            <Icon
              name="camera"
              size={17}
              color={"grey"}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                bottom: 7,
                right: -3,
              }}
            />
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={{ fontSize: 25, fontWeight: 500 }}>
              {user.UserFirstName + " " + user.UserLastName}
            </Text>
            <Text style={{ marginLeft: 5, fontSize: 12, color: "grey" }}>
              {user.UserFaves?user.UserFaves.length:0} favourit items {reviewCount?reviewCount:0} pending reviews
            </Text>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate("ProfileDetails")}>

          <Icon name="settings" size={25} />
          </TouchableOpacity>
        </View>

        {/* order panel */}
        <View
          style={{ marginTop: 30, borderRadius: 15, backgroundColor: "white" }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 17, fontWeight: 500 }}>My Orders</Text>
            <TouchableOpacity onPress={() => {navigation.navigate("myOrders",{type:'all'})}}>
              <Text style={{ fontSize: 13 }}>View all Orders &gt;</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={() => {navigation.navigate("myOrders",{type:-1})}}
            >
              <Icon name="package" size={35} color={"darkorange"} />
              <Text style={{ fontSize: 13, marginTop: 5 }}>To Ship</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={() => {navigation.navigate("myOrders",{type:0})}}
            >
              <Icon name="package" size={35} color={"darkorange"} />
              <Text style={{ fontSize: 13, marginTop: 5 }}>To Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={() => {navigation.navigate("myOrders",{type:1})}}
            >
              <Icon name="package" size={35} color={"darkorange"} />
              <Text style={{ fontSize: 13, marginTop: 5 }}>To Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={() => {navigation.navigate("myOrders",{type:2})}}
            >
              <Icon name="package" size={35} color={"darkorange"} />
              <Text style={{ fontSize: 13, marginTop: 5 }}>To Return</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* middle pannel */}

      <View>
        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 5,
              padding: 25,
              borderRadius: 15,
              backgroundColor: "white",
            }}
            onPress={() =>
              navigation.push("myAddress", { Email: email, authKey: auth })
            }
          >
            <Text style={{ fontWeight: 500, fontSize: 16 }}>My Address</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 5,
              padding: 25,
              borderRadius: 15,
              backgroundColor: "white",
            }}
            onPress={() => navigation.push("myFavs")}
          >
            <Text style={{ fontWeight: 500, fontSize: 16 }}>Favourites</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            width: "80%",
            backgroundColor: Red,
            alignSelf: "center",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
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
          <Text style={{ color: "white", fontWeight: 600, fontSize: 17 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* bottom pannel */}
      <View
        style={{
          padding: 10,
          marginTop: 20,
          flexDirection: "row",
          backgroundColor: "white",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="phone" size={35} color={"black"} />
          <Text>Contact us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="mail" size={35} color={"black"} />
          <Text>My notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="message-square" size={35} color={"black"} />
          <Text>My reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="info" size={35} color={"black"} />
          <Text>Learn more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default UserProfile;

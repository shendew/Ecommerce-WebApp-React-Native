import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BaseUrl } from "../Utils/Constrains";
Loading
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Entypo";
import axios from "axios";
import Loading from "../Utils/Loading";

const MyAddress = ({ route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const [isAddressLoading, setIsAddressLoading] = useState(true);

  const [Address, setAddress] = useState("");

  const getAddress = async () => {
    setIsAddressLoading(true);
    axios
      .post(
        BaseUrl + "/auth/address",
        {
          UserEmail: route.params.Email,
          authKey: route.params.authKey,
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
          setAddress(da.address);
          console.log(da.address)
          setIsAddressLoading(false);
        } else {
          console.log("Failed to get Address" + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getAddress();
    });
  }, []);

  return (
    <View>
      {/* <StatusBar backgroundColor={"white"} barStyle={"dark-content"} /> */}
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
          My Address
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          // height: "20%",
          borderRadius: 10,
          marginHorizontal: 5,
          backgroundColor: "white",
          marginTop: 7,
          paddingVertical: 10,
        }}
      >
        {isAddressLoading ? (
          <Loading />
        ) : (
          <View>
            {Address.length == 0 ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddAddressScreen", {
                    authKey: route.params.authKey,
                    Email: route.params.Email,
                    type: "add",
                  });
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="plus" size={12} style={{ marginRight: 5 }} />
                  <Text style={{}}>Add Address</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
                }}
                onPress={() => {
                  navigation.navigate("AddAddressScreen", {
                    authKey: route.params.authKey,
                    Email: route.params.Email,
                    type: "update",
                    address: Address[0],
                  });
                }}
              >
                <Icon2 name="location" size={20} style={{ margin: 20 }} />
                <View style={{ flex: 1 }}>
                  <Text size={15} style={{ fontWeight: 600 }}>
                    {Address[0].Address}
                  </Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: 600, color: "grey" }}
                  >
                    {Address[0].FName+" "+Address[0].LName}
                  </Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: 600, color: "grey" }}
                  >
                    {Address[0].Number}
                  </Text>
                </View>
                <Icon2
                  name="chevron-small-right"
                  size={20}
                  style={{ margin: 15 }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MyAddress;

import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { BaseUrl } from "../Utils/Constrains";
import { emptyValidator } from "../Helpers/emptyValidator";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

import { StatusBar } from "expo-status-bar";

const AddAddress = ({ route }) => {
  const params = route.params;
  const { type } = params;
  const navigation = useNavigation();
  const [details, setDetails] = useState({
    fullname: type == "update" ? params.address.FullName : "",
    number: type == "update" ? params.address.Number : "",
    province: type == "update" ? params.address.Provice : "",
    address: type == "update" ? params.address.Address : "",
    zipcode: type == "update" ? params.address.ZipCode : "",
    landmarks: type == "update" ? params.address.Landmarks : "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [provinceError, setProvinceError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [zipError, setZipError] = useState(false);

  const handleChange = (name, value) => {
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const validateInputs = () => {
    setNameError(emptyValidator(details.fullname));
    setPhoneError(emptyValidator(details.number));
    setProvinceError(emptyValidator(details.province));
    setAddressError(emptyValidator(details.address));
    setZipError(emptyValidator(details.zipcode));

    if (
      details.fullname &&
      details.number &&
      details.province &&
      details.address &&
      details.zipcode
    ) {
      type == "update" ? updateAddress() : addAddress();
    }
  };

  const addAddress = () => {
    axios
      .put(
        BaseUrl + "/auth/address",
        {
          UserEmail: route.params.Email,
          authKey: route.params.authKey,
          type: "add",
          address: details.address,
          fullname: details.fullname,
          province: details.province,
          landmarks: details.landmarks,
          zipcode: details.zipcode,
          number: details.number,
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
          console.log("Success");
        } else {
          console.log("Failed to update" + da.msg);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  const updateAddress = () => {
    axios
      .put(
        BaseUrl + "/auth/address",
        {
          UserEmail: route.params.Email,
          authKey: route.params.authKey,
          type: "update",
          id: params.address.AddressID,
          address: details.address,
          fullname: details.fullname,
          province: details.province,
          landmarks: details.landmarks,
          zipcode: details.zipcode,
          number: details.number,
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
          console.log("Success");

          navigation.goBack();
        } else {
          console.log("Failed to update" + da.msg);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {}, []);
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
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
          {type} Address
        </Text>
      </View>
      <View style={{ alignItems: "center", flex: 1 }}>
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: nameError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Full Name"
          placeholderTextColor={"#606060"}
          value={details.fullname}
          name={"fullname"}
          onChangeText={(value) => handleChange("fullname", value)}
        />

        <TextInput
          style={[
            styles.searchBox,
            { borderColor: phoneError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Mobile Number"
          placeholderTextColor={"#606060"}
          keyboardType="phone-pad"
          onChangeText={(value) => handleChange("number", value)}
          value={details.number}
          name={"number"}
        />
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: provinceError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Province"
          placeholderTextColor={"#606060"}
          onChangeText={(value) => handleChange("province", value)}
          value={details.province}
          name={"province"}
        />
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: addressError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Address"
          placeholderTextColor={"#606060"}
          onChangeText={(value) => handleChange("address", value)}
          value={details.address}
          name={"address"}
        />
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: zipError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Zip code"
          placeholderTextColor={"#606060"}
          onChangeText={(value) => handleChange("zipcode", value)}
          value={details.zipcode}
          name={"zipcode"}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Landmarks"
          placeholderTextColor={"#606060"}
          onChangeText={(value) => handleChange("landmarks", value)}
          value={details.landmarks}
          name={"landmarks"}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#bb0000",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          height: 45,
          width: "80%",
          borderRadius: 15,
          marginBottom: 10,
          marginTop: 10,
        }}
        onPress={() => {
          validateInputs();
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontWeight: 600 }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
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

export default AddAddress;

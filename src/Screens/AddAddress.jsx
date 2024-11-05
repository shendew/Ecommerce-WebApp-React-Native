import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { BaseUrl } from "../Utils/Constrains";
// import { emptyValidator } from "em";

import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

// import { StatusBar } from "status";
import { emptyValidator } from "../Validators/emptyValidator";
import Loading from "../Utils/Loading";

const AddAddress = ({ route }) => {
  const params = route.params;
  const { type } = params;
  const navigation = useNavigation();
  const [details, setDetails] = useState({
    fname: type == "update" ? params.address.FName : "",
    lname: type == "update" ? params.address.LName : "",
    number: type == "update" ? params.address.Number : "",
    province: type == "update" ? params.address.Provice : "",
    address: type == "update" ? params.address.Address : "",
    zipcode: type == "update" ? params.address.ZipCode : "",
    city: type == "update" ? params.address.City : "",
    country: type == "update" ? params.address.Country : "",
    landmarks: type == "update" ? params.address.Landmarks : "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [fnameError, setFNameError] = useState(false);
  const [lnameError, setLNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [provinceError, setProvinceError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [zipError, setZipError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [countryError, setCountryError] = useState(false);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0


  const handleChange = (name, value) => {
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const validateInputs = () => {
    setFNameError(emptyValidator(details.fname));
    setLNameError(emptyValidator(details.lname));
    setPhoneError(emptyValidator(details.number));
    setProvinceError(emptyValidator(details.province));
    setAddressError(emptyValidator(details.address));
    setZipError(emptyValidator(details.zipcode));
    setCityError(emptyValidator(details.city));
    setCountryError(emptyValidator(details.country));

    if (
      details.fname &&
      details.lname &&
      details.number &&
      details.province &&
      details.address &&
      details.zipcode &&
      details.city &&
      details.country
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
          fname: details.fname,
          lname: details.lname,
          province: details.province,
          landmarks: details.landmarks,
          zipcode: details.zipcode,
          number: details.number,
          city: details.city,
          country: details.country,
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
          fname: details.fname,
          lname: details.lname,
          province: details.province,
          landmarks: details.landmarks,
          zipcode: details.zipcode,
          number: details.number,
          city: details.city,
          country: details.country,
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
  return isLoading?<Loading/>:(
    <View style={{ flex: 1, flexDirection: "column" }}>
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
          {type.charAt(0).toUpperCase()+type.slice(1)} Address
        </Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
      <ScrollView >
        <View style={{alignItems: "center"}}>
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: fnameError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="First Name"
          placeholderTextColor={"#606060"}
          value={details.fname}
          name={"fname"}
          onChangeText={(value) => handleChange("fname", value)}
        />
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: lnameError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Last Name"
          placeholderTextColor={"#606060"}
          value={details.lname}
          name={"lname"}
          onChangeText={(value) => handleChange("lname", value)}
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
            { borderColor: cityError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="City"
          placeholderTextColor={"#606060"}
          onChangeText={(value) => handleChange("city", value)}
          value={details.city}
          name={"city"}
        />
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: countryError ? "red" : "#ffffff", borderWidth: 1 },
          ]}
          placeholder="Country"
          placeholderTextColor={"#606060"}
          onChangeText={(value) => handleChange("country", value)}
          value={details.country}
          name={"country"}
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
      </ScrollView>
        </KeyboardAvoidingView>
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

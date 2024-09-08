import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useState } from "react";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";

const AddAddress = ({route}) => {
    const navigation=useNavigation();
    const [details,setDetails]=useState({
        fullname:'',
        number:'',
        province:'',
        address:'',
        zipcode:'',
        landmarks:''
    });

    const handleChange=(e)=>{
        const {name,value} =e.target;
        setDetails((prev)=>{
            return{...prev, [name]: value}
        });
    }

    const addAddress=()=>{
        axios
      .put(
        "https://ebuy-backend.onrender.com" + "/auth/address",
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
    }
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            backgroundColor: "white",
            paddingVertical: 20,
            paddingLeft: 10,
          }}
        >
          Add Address
        </Text>
      </View>
      <View style={{ alignItems: "center" ,flex:1}}>
        <TextInput
          style={styles.searchBox}
          placeholder="Full Name"
          placeholderTextColor={"#606060"}
            onChangeText={handleChange}
            value={details.fullname}
            
            name={"fullname"}
          // onFocus={()=>{navigation.push("SearchScreens",{txt:searchTxt})}}
          //   returnKeyType="search"
          //   onSubmitEditing={() => {
          //     navigation.push("SearchScreens", { text: searchTxt });
          //   }}
        />

        <TextInput
          style={styles.searchBox}
          placeholder="Mobile Number"
          placeholderTextColor={"#606060"}
          keyboardType='phone-pad'
          onChangeText={handleChange}
            value={details.number}
            name={"number"}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Province"
          placeholderTextColor={"#606060"}
          onChangeText={handleChange}
            value={details.province}
            name={"province"}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Address"
          placeholderTextColor={"#606060"}
          onChangeText={handleChange}
            value={details.address}
            name={"address"}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Zip code"
          placeholderTextColor={"#606060"}
          onChangeText={handleChange}
            value={details.zipcode}
            name={"zipcode"}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Landmarks"
          placeholderTextColor={"#606060"}
          onChangeText={handleChange}
            value={details.landmarks}
            name={"landmarks"}
        />

        
      </View>
      <TouchableOpacity style={{
              backgroundColor: "#bb0000",
              alignItems: "center",
              alignSelf:'center',
              justifyContent: "center",
              height: 45,
              width: "80%",
              borderRadius: 15,
              marginBottom: 10,
              marginTop:10
            }}
            onPress={()=>{
                navigation.goBack();
            }}>
                <Text style={{color:'white',fontSize:15,fontWeight:600}}>Save</Text>
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

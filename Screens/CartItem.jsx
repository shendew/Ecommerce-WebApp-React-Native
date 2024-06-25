import { View, Text, Alert } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import Icon2 from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function CartItem({product,index,qty,reFreshStat,auth,email}) {

  const deleteCar=async(pID)=>{
    
    axios
      .delete(
        "https://ebuy-backend.onrender.com" + "/auth/cart",
        
        {
          data :{
            UserEmail: email,
            authKey: auth,
            productID:pID,
          },
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const da = response.data;
        if(da.status == 103 && da.msg == "Delete Success" ){
          reFreshStat(true);
        }else{
          console.log("Failed to update"+da.msg)
        }

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <View
              style={{
                width: "100%",
                backgroundColor: "white",

                padding: 10,
                marginBottom:5,
              }}
            >
              <Icon style={{alignSelf:'flex-end',marginHorizontal:5}} name="trash" size={20} color="black" 
              onPress={()=>{
                deleteCar(qty[index].productID)
              }}/>
              <View
                style={{ borderBottomColor: "black", borderBottomWidth: 1 ,flexDirection:'row',paddingBottom:5}}
              >
                <Image height={100} width={undefined} style={{aspectRatio:1}} source={{uri:product.thumbnail}}/>

                <View style={{flex:1,marginLeft:5,justifyContent:'space-between',paddingLeft:5}}>

                  <View style={{flex:1,justifyContent: 'space-around'}}>
                    <Text>{product.productTitle}</Text>
                    <Text>x{qty[index].QTY}</Text>
                  </View>

                  <View style={{padding:10}}>
                  <Text style={{textAlign:'right',fontSize:20,fontWeight:500}}>LKR:{(product.productPrice*(100-product.discountPercentage)/100 )*qty[index].QTY}</Text>
                  </View>
                  

                </View>
              </View>
            </View>
  )
}
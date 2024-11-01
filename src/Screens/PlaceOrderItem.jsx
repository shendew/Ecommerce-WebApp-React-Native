import { View, Text, Alert } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import Icon2 from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PlaceOrderItem({data}) {

const navigation=useNavigation();

  return (
    <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "white",

                padding: 10,
                // marginBottom:5,
              }}
             onPress={()=>{
              navigation.push("ProductView", { data: data })
             }} 
            >
              <View
                style={{ borderBottomColor: "black", borderBottomWidth: 1 ,flexDirection:'row',paddingBottom:5}}
              >
                <Image height={100} width={undefined} style={{aspectRatio:1}} source={{uri:data.thumbnail}}/>

                <View style={{flex:1,marginLeft:5,justifyContent:'space-between',paddingLeft:5}}>

                  <View style={{flex:1,justifyContent: 'space-around'}}>
                    <Text style={{color:'black'}}>{data.productTitle}</Text>
                    {/* <Text>x{qty}</Text> */}
                  </View>

                  <View style={{padding:10}}>
                  {/* <Text style={{textAlign:'right',fontSize:16,fontWeight:500}}>LKR:{(data.productPrice*(100-data.discountPercentage)/100 )}</Text> */}
                  <Text style={{textAlign:'right',fontSize:16,fontWeight:500}}>LKR:{(data.productPrice)}</Text>
                  </View>
                  

                </View>
              </View>
            </TouchableOpacity>
  )
}
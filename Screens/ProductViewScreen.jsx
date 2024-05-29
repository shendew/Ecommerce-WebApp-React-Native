import { useNavigation } from "@react-navigation/native";
import { Button, Image, StatusBar, TouchableOpacity } from "react-native";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from 'react-native-vector-icons/Feather';
import { ScrollView } from "react-native";


function ProductViewScreen({ route }) {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={{ width: "100%", height: '100%',flexDirection:'column'}}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={{ width: "100%", height: '8%', backgroundColor: "white",flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',paddingHorizontal:15,paddingBottom:7,elevation: 1}}>
        <Icon name="angle-left" size={30} color="black" onPress={()=>{navigation.goBack()}}/>
        <Icon2 name="shopping-cart" size={25} color="black" onPress={()=>{navigation.navigate("My Cart")}}/>
      </View>
      <ScrollView style={{paddingTop:5,height:'85%'}}>
      <Image width={'100%'} height={undefined} style={{aspectRatio:1}} source={{uri:route.params.data.thumbnail}}/>
      <View style={{paddingHorizontal:5,marginTop:10,borderRadius:1,marginHorizontal:5,backgroundColor:'white',paddingVertical:15}}>
      <Text style={{fontSize:18,fontWeight:600,}}>{route.params.data.productTitle}</Text>
      <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems:'flex-end',
            marginTop:10,
            marginBottom:15,
          }}
        >
          

          <Text style={{ color: "black", fontWeight: 600,marginRight:10,fontSize:22}}>
          {"LKR : " +
            (
              (route.params.data.productPrice * (100 - route.params.data.discountPercentage)) /
              100
            )}
      </Text>

      <Text
            style={{
              color: "#00000",
              
              fontWeight: 600,
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
              textDecorationColor: "#ff0000",
              color: "#d3d3d3",
              fontSize:16,
              
            }}
          >
            {"LKR :" + route.params.data.productPrice + "   "}
          </Text>
          <Text style={{ color: "black",fontSize:16}}>
            {route.params.data.discountPercentage + "% OFF"}
          </Text>
        </View>
        

      <Text>Product Details</Text>
      <Text style={{fontSize:11,marginTop:15,lineHeight:16}}>{route.params.data.productDescription}</Text>
      </View>
      </ScrollView>
      <View style={{flexDirection:'row',width:'100%',height:'7%',justifyContent:'space-around'}}>
       <TouchableOpacity style={{flex:1,justifyContent:'center',borderRadius:5,margin:5,borderWidth:1}}><Text style={{textAlign:'center',fontSize:15,fontWeight:600}}>Add to Cart</Text></TouchableOpacity> 
       <TouchableOpacity style={{backgroundColor:'#7c0a0a',flex:1,justifyContent:'center',borderRadius:5,margin:5}}><Text style={{textAlign:'center',fontSize:15,fontWeight:600,color:'white'}}>Buy it now</Text></TouchableOpacity> 
      </View>
    </SafeAreaView>
  );
}

export default ProductViewScreen;

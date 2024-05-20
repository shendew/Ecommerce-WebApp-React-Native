import { useNavigation } from "@react-navigation/native";
import { Button, Image, StatusBar } from "react-native";
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
    <SafeAreaView style={{ width: "100%", height: height,flexDirection:'column'}}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={{ width: "100%", height: 60, backgroundColor: "white",flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',paddingHorizontal:15,paddingBottom:7,elevation: 1}}>
        <Icon name="angle-left" size={30} color="black" onPress={()=>{navigation.goBack()}}/>
        <Icon2 name="shopping-cart" size={25} color="black" onPress={()=>{navigation.navigate("My Cart")}}/>
      </View>
      <ScrollView style={{paddingTop:5}}>
      <Image width={'100%'} height={undefined} style={{aspectRatio:1}} source={{uri:route.params.data.thumbnail}}/>
      <View style={{paddingHorizontal:5,marginTop:10}}>
      <Text style={{fontSize:18,fontWeight:600,}}>{route.params.data.productTitle}</Text>
      <Text style={{fontSize:11,marginTop:15}}>{route.params.data.productDescription}</Text>

      <Button title="Add to Cart"></Button>
      <Button title="Buy it now"></Button>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProductViewScreen;

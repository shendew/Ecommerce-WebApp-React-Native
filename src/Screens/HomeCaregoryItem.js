import React from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import logo from '../img/logo.png';
import { useNavigation } from '@react-navigation/native';


function HomeCaregoryItem({item,index}) {
  
  const navigation=this.props.navigation;
  const CategoryClick=(item)=>{
    Alert.alert("Clicked : "+item.cateTitle);
    //props.navigation.navigate("Home1")
    navigation.push("CategoryViewPage", { data: item });
  }
  return (
    <TouchableOpacity onPress={()=>CategoryClick(item)}>
    <View key={item.cateID} style={{width:60,flexDirection:"column",marginHorizontal:10,alignItems:'center'}}>
        <Image source={{uri:"https://convenienceworldmagazine.com.au/wp-content/uploads/2020/10/shutterstock_570190258-scaled.jpg"}} style={{borderRadius:25,width:50,height:50,}}/>
        <Text style={{fontSize:11,marginTop:5}}>{item.cateTitle}</Text>
    </View>
    </TouchableOpacity>  
  )
}

export default HomeCaregoryItem;

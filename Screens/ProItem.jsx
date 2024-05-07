import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import pIMG  from '../img/p2.jpg'
import addCart from '../img/addtocart.png'
import { scale } from 'react-native-size-matters'


  export default function ProItem({item,index}) {
    return (
    <View key={index} style={{flex:1,backgroundColor:'white',margin:2,borderRadius:15}}>
      
      <Image source={{uri:item.thumbnail}} style={{width:'100%',borderRadius:15,height:undefined,aspectRatio:1}} /> 
      <Text style={{ width:'100%',textAlign:'center'}}>{item.productTitle}</Text>
      {/* <Image source={addCart} style={styles.proAddC}/> */}
      <Text style={styles.proPrice}>{"LKR :1000.00"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
})
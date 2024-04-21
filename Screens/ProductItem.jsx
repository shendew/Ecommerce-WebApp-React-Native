import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import pIMG  from '../img/productimg.png'
import addCart from '../img/addtocart.png'

export default function ProductItem() {
  return (
    <View style={styles.productContainer}>
      
      <Image source={pIMG} style={{resizeMode: 'cover',width:'100%',}}/> 
      <Text style={styles.proTitle}>Off Shoulder Short Sleeve - Women</Text>
      <Image source={addCart} style={styles.addC}/>
      <Text style={styles.proPrice}>LKR : 4300.00</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    productContainer:{
        width:'48%',
        height:'33%',
        borderWidth:0.7,
        borderColor:'gray',
        justifyContent:'space-between',
        marginTop:10,
    },
    addC:{
      alignSelf: 'flex-end',
      top:'-81%',
      right:'3%',
      height:25,
      width:25,
      resizeMode: 'cover'
    },
    proTitle:{
      paddingHorizontal:5,

      
    },
    proPrice:{
      paddingHorizontal:5,
      fontSize:17,
      marginBottom:5,
      fontWeight:'600',
      color:'red'
    }
})
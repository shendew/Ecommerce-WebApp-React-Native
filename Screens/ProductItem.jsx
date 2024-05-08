import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import pIMG  from '../img/productimg.png'
import addCart from '../img/addtocart.png'


  export default function ProductItem({ productID , productTitle, productDescription,productPrice,discountPercentage,rating,stock,brand,category,thumbnail,images}) {
    return (
    <View style={styles.productContainer}>
      
      <Image source={{uri:thumbnail}} style={{width:"100%",height:"60%"}}/> 
      <Text style={styles.proTitle}>{productTitle}</Text>
      <Image source={addCart} style={styles.addC}/>
      <Text style={styles.proPrice}>{"LKR :"+productPrice+".00"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    // productContainer:{
    //     width:'48%',
    //     // height:'21%',
    //     // width:175,
    //     height: 300,
    //     borderWidth:0.7,
    //     borderColor:'gray',
    //     justifyContent:'space-between',
    //     marginTop:10,
    // },
    // addC:{
    //   alignSelf: 'flex-end',
    //   top:'-81%',
    //   right:'3%',
    //   height:25,
    //   width:25,
    //   resizeMode: 'cover'
    // },
    // proTitle:{
    //   paddingHorizontal:5,

      
    // },
    // proPrice:{
    //   paddingHorizontal:5,
    //   fontSize:17,
    //   marginBottom:5,
    //   fontWeight:'600',
    //   color:'red'
    // }
})
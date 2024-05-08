import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import pIMG  from '../img/p2.jpg'
import addCart from '../img/addtocart.png'
import { scale } from 'react-native-size-matters'


  export default function ProItem({item,index}) {
    return (
    <View key={item.productID} style={{flexGrow: 1,
      width: "40%",backgroundColor:'white',marginHorizontal:5,borderRadius:15}}>
      
      <Image source={{uri:item.thumbnail}} style={{width:'100%',borderRadius:15,height:undefined,aspectRatio:1}} /> 
      <Text style={{ width:'100%',marginHorizontal:5}}>{item.productTitle}</Text>
      {/* <Image source={addCart} style={styles.proAddC}/> */}
      <Text style={{color:'black',fontWeight:600,margin:10}}>{"LKR : "+(item.productPrice*(100-item.discountPercentage)/100).toFixed(2)}</Text>
      <View style={{flexDirection:'row',marginHorizontal:10,marginBottom:5}}>
      <Text style={{color:'black',fontSize:11,fontWeight:600,textDecorationLine: 'line-through',textDecorationStyle: 'solid',textDecorationColor: '#ff0000',color: '#d3d3d3',}}>{"LKR :"+item.productPrice.toFixed(2)+"   "}</Text>
      <Text style={{color:'black',fontSize:11,fontWeight:600,}}>{item.discountPercentage+"% OFF"}</Text>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productContainer:{
    width:'48%',
    // height:'21%',
    // width:175,
    height: 300,
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
  color:'red',
  
}
})
import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ProductItem from './ProductItem'


export default function HomePage() {
  return (
    <ScrollView>
    <View style={{flex:1,flexDirection:'row',padding:10,flexWrap:'wrap', justifyContent:'space-around'}}>
      {/* <Text>HomePage</Text> */}
      <ProductItem/>
      <ProductItem/>
      <ProductItem/>
      <ProductItem/>
      <ProductItem/>
    </View>
    </ScrollView>
  )
}
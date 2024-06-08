import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

export default function CartItem({product,index,qty}) {
  console.log(product)
  console.log(index)
  console.log(qty)
  return (
    <View
              style={{
                width: "100%",
                backgroundColor: "white",

                padding: 10,
              }}
            >
              <View
                style={{ borderBottomColor: "black", borderBottomWidth: 1 ,flexDirection:'row'}}
              >
                <Image height={100} width={undefined} style={{aspectRatio:1}} source={{uri:product[0].thumbnail}}/>
                <View style={{marginLeft:5}}>
                  <Text>{product[0].productTitle}</Text>
                  <Text>{product[0].productPrice}</Text>
                  <Text>{qty[index].QTY}</Text>

                </View>
              </View>
            </View>
  )
}
import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

export default function CartItem({item,index}) {
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
                <Image height={100} width={undefined} style={{aspectRatio:1}} source={{uri:item[0].thumbnail}}/>
                <View style={{marginLeft:5}}>
                  <Text>{item[0].productTitle}</Text>
                  <Text>{item[0].productPrice}</Text>

                </View>
              </View>
            </View>
  )
}
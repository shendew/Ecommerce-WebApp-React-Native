import React from 'react'
import { Dimensions, FlatList, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import ProItem from './ProItem';
const Products = require("../jsonData/Products.json");
import SliderBox from 'react-native-image-slider-box';

const { width, height } = Dimensions.get("window");



function Category({route,navigation}) {
    const statusHight=StatusBar.currentHeight;

  return (
    < SafeAreaView style={{paddingTop:statusHight+5,flex:1,alignItems:'center'}}>
        
        <Text style={{fontSize:18,fontWeight:600}}>{route.params.name.cateTitle}</Text>

        <ScrollView>
        <View
              style={{
                // flex:1,
                // height: 500,
                flexDirection: "row",
                padding: 10,
                flexWrap: "wrap",
                justifyContent: "space-around",
                // backgroundColor: "yellow",
              }}
            >
              <FlatList
                data={Products}
                renderItem={ProItem}
                numColumns={2}
                scrollEnabled
              />
            </View>
            </ScrollView>
        
        </SafeAreaView>
  )
}

export default Category
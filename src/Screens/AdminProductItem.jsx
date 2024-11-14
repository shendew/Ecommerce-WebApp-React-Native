import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useState} from 'react';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BaseUrl, LocalBaseUrl, Red } from '../Utils/Constrains';
import Toast from 'react-native-toast-message';

const AdminProductItem = ({product, isUpdated}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [isDelShow, setIsDelShow] = useState(false);

  const deleteProduct=()=>{
    axios
    .post(
      BaseUrl + '/api/deleteProduct',
      {
        productID: product.productID
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      },
    )
    .then(function (response) {
      const da = response.data;
      setIsLoading(false);
      setIsShow(false)
      if(da.status===103){
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delete successfully",
        });
        console.log("Delete successfully")
        isUpdated()
      }else{
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Delete failed.",
        });
        console.log("Delete failed")
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <TouchableOpacity style={{backgroundColor: 'white', padding: 5, margin: 5}} 
    onPress={()=>navigation.push("ProductView", { data: product })}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: 'black'}}>{product.productTitle}</Text>
        <TouchableOpacity onPress={()=>setIsShow(true)}>
          <Icon style={{color: 'black'}} name={'delete'} size={25} />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Image
          source={{uri: product.thumbnail}}
          style={{width: 100, aspectRatio: 1}}
        />
        <View style={{flex: 1, padding: 5}}>
          <View style={{flex: 1}}>
            <Text>LKR: {product.productPrice}</Text>
            <Text>Discount: {product.discountPercentage}%</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}>
            <Text>QTY:{product.stock}</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'black',
                alignSelf: 'baseline',
                paddingVertical: 3,
                paddingHorizontal: 10,
                borderRadius: 7,
              }}
              onPress={()=>navigation.push("UpdateProduct",{product:product})}
              >
              <Text style={{fontSize: 12}}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal transparent animationType="fade" visible={isShow}>
        <TouchableOpacity
          onPress={() => {
            setIsShow(false);
          }}
          style={{
            flex: 1,
            backgroundColor: '#000000AA',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableWithoutFeedback
            style={
              {
                // width: "100%",
              }
            }>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                width: '90%',
                padding: 10,
                maxHeight: '40%',
                // justifyContent: "space-around",
                borderRadius: 10,
              }}>
              <Text style={{fontWeight: 600, fontSize: 17, marginBottom: 30}}>
                Confirm Action
              </Text>
              <Text
                style={{fontSize: 16, alignSelf: 'center', marginBottom: 40}}>
                Do you want to delete this product
              </Text>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Red,
                    borderRadius: 10,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => deleteProduct()}>
                  <Text style={{color: 'white'}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setIsShow(false)}>
                  <Text style={{}}>Keep</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default AdminProductItem;

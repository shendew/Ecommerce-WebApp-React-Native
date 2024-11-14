import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import * as ImagePicker from "expo-image-picker";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import axios from 'axios';
import {BaseUrl, LocalBaseUrl, Main} from '../Utils/Constrains';
// import Loading from "./Loading";
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {emptyValidator} from '../Validators/emptyValidator';
const {height} = Dimensions.get('window');
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import Loading from '../Utils/Loading';
import {delay} from '../Utils/Delay';

const UpdateProduct = ({route}) => {
  const navigation = useNavigation();
  const {product} = route.params;
  const [pickedImage, setPickedImage] = useState(product.thumbnail);
  const [isLoading, setIsLoading] = useState(false);

  const [productTitle, setProductTitle] = useState(product.productTitle);
  const [titleErr, settitleErr] = useState(false);
  const [productDesc, setProductDesc] = useState(product.productDescription);
  const [descErr, setdescErr] = useState(false);
  const [productPrice, setProductPrice] = useState(product.productPrice + '');
  const [priceErr, setpriceErr] = useState(false);
  const [discountPrecentage, setDiscountPrecentage] = useState(
    product.discountPercentage + '',
  );
  const [discountErr, setdiscountErr] = useState(false);
  const [productStock, setProductStock] = useState(product.stock + '');
  const [stockErr, setstockErr] = useState(false);
  const [cateErr, setcateErr] = useState(false);
  const [value, setValue] = useState(parseInt(product.category));
  const [brandErr, setbrandErr] = useState(false);
  const [productBrand, setProductBrand] = useState(product.brand);

  const [Categories, setCategories] = useState([]);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && <Icon color="black" name="done" size={20} />}
      </View>
    );
  };

  const getCategires = async () => {
    axios
      .get(BaseUrl + '/api/categories')
      .then(response => {
        let cat = [];
        response.data.value.map((value, index, array) => {
          cat[index] = {label: value.cateTitle, value: value.cateID};
        });
        setCategories(cat);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getAuthToken = async () => {
    setIsLoading(true);
    await AsyncStorage.getItem('AUTH_TOKEN').then(async a => {
      await AsyncStorage.getItem('USER_EMAIL').then(async e => {
        updateProduct(e, a);
      });
    });
  };

  const updateProduct = (e, a) => {
    const formData = new FormData();
    formData.append('UserEmail', e);
    formData.append('authKey', a);
    formData.append('productID', product.productID);

    formData.append('productTitle', productTitle);
    formData.append('productDescription', productDesc);
    formData.append('productPrice', productPrice);
    formData.append('discountPercentage', discountPrecentage);
    formData.append('stock', productStock);
    formData.append('brand', productBrand);
    formData.append('category', value);

    axios
      .post(BaseUrl + '/api/productUpdate', 
        {
          productID:product.productID,
          productTitle:productTitle,
          productDescription:productDesc,
          productPrice:productPrice,
          discountPercentage:discountPrecentage,
          stock:productStock,
          brand:productBrand,
          category:value
        }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      })
      .then(function (response) {
        setIsLoading(false);
        const da = response.data;
        if (da.status == 103) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Product updated successfully.',
          });
          delay(2000);
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to update product',
          });
        }
      })
      .catch(function (error) {
        setIsLoading(false);

        console.log(error);
      });
  };

  useEffect(() => {
    getCategires();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <View style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          height: 60,
          backgroundColor: 'white',
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingBottom: 7,
          // elevation: 1,
          alignItems: 'flex-end',
        }}>
        <Text>
          <Icon
            style={{}}
            name="angle-left"
            size={30}
            color="black"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Text>
        <Text
          style={{
            fontSize: 19,
            textAlign: 'center',
            fontWeight: 600,
            flex: 1,
          }}>
          Update Product
        </Text>
      </View>

      {/* thumbnail */}

      <ScrollView
        contentContainerStyle={{
          height: height + 550,
          padding: 10,
        }}>
        <View style={{flex: 1}}>
          <Image
            source={{uri: pickedImage}}
            style={{aspectRatio: 1, borderRadius: 10}}
          />

          {/* category */}
          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Category
          </Text>

          <Dropdown
            style={{
              marginVertical: 10,
              height: 50,
              backgroundColor: 'white',
              borderColor: cateErr ? 'red' : 'white',
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={Categories}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              setValue(item.value);
              console.log(item.value);
            }}
            renderItem={renderItem}
          />

          {/* productTitle */}
          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Product Name
          </Text>
          <TextInput
            style={{
              borderColor: titleErr ? 'red' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
            placeholder="Product Name"
            value={productTitle}
            onChangeText={txt => setProductTitle(txt)}
          />
          {/* productDescription */}
          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Product Description
          </Text>

          <TextInput
            multiline={true}
            style={{
              borderColor: descErr ? 'red' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              minHeight: 150,
              marginBottom: 10,
              textAlignVertical: 'top',
            }}
            placeholder="Product Description"
            value={productDesc}
            onChangeText={txt => setProductDesc(txt)}
          />

          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Product Brand
          </Text>

          <TextInput
            style={{
              borderColor: brandErr ? 'red' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
            placeholder="Brand name"
            value={productBrand}
            onChangeText={txt => setProductBrand(txt)}
          />

          {/* productPrice */}
          {/* discountPrecentage */}

          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Product Price
          </Text>

          <TextInput
            style={{
              borderColor: priceErr ? 'red' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
            keyboardType="number-pad"
            placeholder="163"
            value={productPrice}
            onChangeText={txt => setProductPrice(txt)}
          />
          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Discount Precentage
          </Text>

          <TextInput
            style={{
              borderColor: discountErr ? 'red' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
            keyboardType="number-pad"
            placeholder="5"
            value={discountPrecentage}
            onChangeText={txt => setDiscountPrecentage(txt)}
          />

          {/* stock */}
          <Text
            style={{
              fontWeight: 600,
              marginVertical: 10,
              marginHorizontal: 5,
            }}>
            Stock
          </Text>

          <TextInput
            style={{
              borderColor: stockErr ? 'red' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
            keyboardType="number-pad"
            placeholder="23"
            value={productStock}
            onChangeText={txt => setProductStock(txt)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: Main,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              marginVertical: 15,
            }}
            onPress={() => getAuthToken()}>
            <Text style={{fontWeight: 600}}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginVertical: 10,
    height: 50,
    backgroundColor: 'white',
    // borderColor: cateErr ?"red":"",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    // elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default UpdateProduct;

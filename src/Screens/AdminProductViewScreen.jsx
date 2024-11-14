import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import {useState} from 'react';
import Loading from '../Utils/Loading';
import {Dialog} from 'react-native-elements';
import {BlurView} from '@react-native-community/blur';
import {useEffect} from 'react';
import {FlatList} from 'react-native';
import ReviewItem from './ReviewItem';
import {Rating} from 'react-native-ratings';
import {StyleSheet} from 'react-native';
import {BaseUrl} from '../Utils/Constrains';

// TODO: Add reviews

function AdminProductViewScreen({route}) {
  const [auth, setAuth] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qtyDialog, setQtyDialog] = useState(false);
  const [quantityC, setQuantityC] = useState(1);
  const navigation = useNavigation();
  const [ratings, setRatings] = useState(0);
  const [saved, setSaved] = useState(false);

  const getAuthToken = async type => {
    await AsyncStorage.getItem('AUTH_TOKEN').then(async a => {
      setAuth(a);
      await AsyncStorage.getItem('USER_EMAIL').then(async e => {
        setEmail(e);
      });
    });
  };

  const calcRatings = () => {
    var rat = 0;
    const itemC = route.params.data.reviews.length;
    if (itemC == 0) {
      setRatings(0);
      // console.log(0);
    } else {
      route.params.data.reviews.map((value, index, array) => {
        rat = rat + value.Rating;
      });
      setRatings(rat / itemC);
      // console.log(rat / itemC);
    }
  };

  useEffect(() => {
    getAuthToken();
    calcRatings();
  }, []);

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      {isLoading ? (
        <Loading />
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              width: '100%',
              height: '8%',
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingHorizontal: 15,
              paddingBottom: 7,
              elevation: 1,
            }}>
            <Icon
              name="angle-left"
              size={30}
              color="black"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text>
              <Icon2
                name="shopping-cart"
                size={25}
                color="black"
                onPress={() => {
                  navigation.navigate('My Cart');
                }}
              />
            </Text>
          </View>
          <ScrollView style={{paddingTop: 5, height: '85%'}}>
            <Image
              style={{aspectRatio: 1}}
              source={{uri: route.params.data.thumbnail}}
            />
            <View
              style={{
                paddingHorizontal: 5,
                marginTop: 10,
                borderRadius: 1,
                marginHorizontal: 5,
                backgroundColor: 'white',
                paddingVertical: 15,
              }}>
              <Text style={{fontSize: 18, fontWeight: 600}}>
                {route.params.data.productTitle}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  alignItems: 'flex-end',
                  marginTop: 10,
                  marginBottom: 15,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 600,
                    marginRight: 10,
                    fontSize: 22,
                  }}>
                  {'LKR : ' +
                    (route.params.data.productPrice *
                      (100 - route.params.data.discountPercentage)) /
                      100}
                </Text>

                <Text
                  style={{
                    color: '#00000',

                    fontWeight: 600,
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    textDecorationColor: '#ff0000',
                    color: '#d3d3d3',
                    fontSize: 16,
                  }}>
                  {'LKR :' + route.params.data.productPrice + '   '}
                </Text>
                <Text style={{color: 'black', fontSize: 16}}>
                  {route.params.data.discountPercentage + '% OFF'}
                </Text>
              </View>

              <Text>Product Details</Text>
              <Text style={{fontSize: 11, marginTop: 15, lineHeight: 16}}>
                {route.params.data.productDescription}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 600, marginVertical: 15}}>
                Reviews
              </Text>

              <Rating
                readonly
                ratingCount={5}
                imageSize={30}
                fractions={1}
                showRating
                startingValue={ratings}
                style={{marginBottom: 10}}
              />
              {route.params.data.reviews.length == 0 ? (
                <Text style={{alignSelf: 'center', margin: 10}}>
                  No Reviews yet...
                </Text>
              ) : (
                <FlatList
                  data={route.params.data.reviews}
                  renderItem={({item}) => {
                    return (
                      <View key={item.UserEmail}>
                        <ReviewItem review={item} />
                      </View>
                    );
                  }}
                  scrollEnabled
                />
              )}

              {/* <ReviewItem review={route.params.data.reviews[0]}/>
              <ReviewItem review={route.params.data.reviews[1]}/> */}
            </View>
          </ScrollView>
        </View>
      )}
      <Toast />

      <Modal
        animationType="fade"
        transparent={true}
        visible={qtyDialog}
        onRequestClose={() => setQtyDialog}>
        <BlurView
          blurType="light"
          blurAmount={100}
          reducedTransparencyFallbackColor="white"
          // intensity={100}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '80%',
              borderRadius: 10,
              padding: 10,
              paddingVertical: 20,
              flexDirection: 'column',
            }}>
            <Text>Select the Quantity</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Icon
                name="minus"
                size={20}
                color="black"
                onPress={() => {
                  setQuantityC(old => (old == 1 ? old : old - 1));
                }}
              />
              <Text style={{marginVertical: 30, alignSelf: 'center'}}>
                {quantityC}
              </Text>
              <Icon
                name="plus"
                size={20}
                color="black"
                onPress={() => {
                  setQuantityC(old => old + 1);
                }}
              />
            </View>

            <Button
              title="Buy"
              onPress={() => {
                setQtyDialog(false);
                navigation.navigate('OrderScreen', {
                  productID: route.params.data.productID,
                  authKey: auth,
                  Email: email,
                  quantity: quantityC,
                });
              }}
            />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

export default AdminProductViewScreen;

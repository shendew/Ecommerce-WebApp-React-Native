import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

function ProductViewScreen({route}) {
  const [auth, setAuth] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qtyDialog, setQtyDialog] = useState(false);
  const [quantityC, setQuantityC] = useState(1);
  const navigation = useNavigation();
  const [ratings, setRatings] = useState(0);
  const [saved, setSaved] = useState(false);

  function QtyModel(){

    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={qtyDialog}
        onRequestClose={() => setQtyDialog}>
          <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'}} o>

          
        
          <View
            style={{
              backgroundColor: 'white',
              width: '80%',
              borderRadius: 10,
              padding: 10,
              // paddingVertical: 20,
              flexDirection: 'column',
            }}>
              <TouchableOpacity onPress={()=>setQtyDialog(false)}>
              <Icon name='close' size={20} style={{alignSelf:'flex-end',marginHorizontal:10,color:'red'}}/>
              </TouchableOpacity>
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
              title="Continue"
              onPress={() => {
                setQtyDialog(false);
                addcar(email, auth);
                setIsLoading(true);
              }}
            />
            </View>
            </View>
      </Modal>
    )
  }

  const getAuthToken = async type => {
    await AsyncStorage.getItem('AUTH_TOKEN').then(async a => {
      setAuth(a);
      await AsyncStorage.getItem('USER_EMAIL').then(async e => {
        setEmail(e);
        getFavs(a, e);
      });
    });
  };

  const getFavs = async (a, e) => {
    axios
      .post(
        BaseUrl + '/auth/fav',
        {
          UserEmail: e,
          authKey: a,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        const da = response.data;
        if (da.status == 103) {
          const u = da.favs;
          u.map(item => {
            if (item.productID === route.params.data.productID) {
              console.log(item.productID);
              setSaved(true);
            }
          });
        } else {
          console.log('Failed to get User' + da.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const openDialog = () => {
    setQtyDialog(true);
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

  const addFav = async () => {
    axios
      .put(
        BaseUrl + '/auth/fav',
        {
          UserEmail: email,
          authKey: auth,
          productID: route.params.data.productID,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        setIsLoading(false);
        const da = response.data;
        if (da.status == 103) {
          setSaved(!saved);

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Item added to favourite',
          });
          console.log('Success');
        } else {
          console.log('Failed to update' + da.status);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  const delFav = async () => {
    axios
      .delete(
        BaseUrl + '/auth/fav',
        {
          data: {
            UserEmail: email,
            authKey: auth,
            productID: route.params.data.productID,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        setIsLoading(false);
        const da = response.data;
        if (da.status == 103) {
          setSaved(!saved);

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Item added to favourite',
          });
          console.log('Success');
        } else {
          console.log('Failed to update' + da.status);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  const addcar = async (e, a) => {
    // console.log(e + a);
    axios
      .put(
        BaseUrl + '/auth/cart',
        {
          UserEmail: e,
          authKey: a,
          productID: route.params.data.productID,
          QTY: quantityC,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
      .then(function (response) {
        setIsLoading(false);
        const da = response.data;
        if (da.status == 103) {
          setSaved(!saved);

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Item added to cart',
          });
          console.log('Success');
        } else {
          console.log('Failed to update' + da.status);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
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
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    elevation: 1,
                    top: 5,
                    right: 0,
                  }}
                  onPress={() => {
                    saved ? delFav() : addFav();
                  }}>
                  <IconMat
                    name={saved ? 'favorite' : 'favorite-border'}
                    // color="red"
                    size={25}
                  />
                </TouchableOpacity>
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
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '7%',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                borderRadius: 5,
                margin: 5,
                borderWidth: 1,
              }}
              onPress={async () => {
                await getAuthToken('cart');
                console.log(auth);
                console.log(email);
                
                openDialog(true);

                // getAuthToken("cart").then((value) => {
                //   console.log(auth)
                //   console.log(email)
                //   addcar(email, auth);
                //   setIsLoading(true);
                // });
              }}>
              <Text
                style={{textAlign: 'center', fontSize: 15, fontWeight: 600}}>
                Add to Cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#7c0a0a',
                flex: 1,
                justifyContent: 'center',
                borderRadius: 5,
                margin: 5,
              }}
              onPress={async () => {
                await getAuthToken('order');
                // setIsLoading(true);
                // openDialog(true);
                navigation.navigate('OrderScreen', {
                  productID: route.params.data.productID,
                  authKey: auth,
                  Email: email,
                  quantity: quantityC,
                });
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'white',
                }}>
                Buy it now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Toast />
      <QtyModel/>
      
    </View>
  );
}

export default ProductViewScreen;

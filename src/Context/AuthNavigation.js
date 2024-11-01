import {Text, View } from "react-native";
// import {LoginPage} from './components/LoginPage';
import {
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginPage from "../Screens/LoginPage";
import Register from "../Screens/Register";
import HomePage from "../Screens/HomePage";
import Cart from "../Screens/Cart";
import Category from "../Screens/Category";

import HomeCaregoryItem from "../Screens/HomeCaregoryItem";
import * as React from "react";
import { useAuth, useUpdateAuth } from "../Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductViewScreen from "../Screens/ProductViewScreen";
import SearchScreen from "../Screens/SearchScreen";
import Icon2 from "react-native-vector-icons/Feather";
// import { useTheme, useUpdateTheme } from "./ThemeContext";

import AddAddress from "../Screens/AddAddress";
// import TestScreen from "./TestScreen";
import UserProfile from "../Screens/UserProfile";
// import LuckeySpinner from "./LuckeySpinner";
import OtpVerificationScreen from "../Screens/OtpVerificationScreen";
import AdminHome from "../Screens/AdminHome";
import AddProduct from "../Screens/AddProduct";
import OrderPage from "../Screens/OrderPage";
import OrderReview from "../Screens/OrderReview";
import OrderDetails from "../Screens/OrderDetails";
import MyAddress from "../Screens/MyAddress";
import MyFavourites from "../Screens/MyFavourites";
import ProfileDetails from "../Screens/ProfileDetails";
import PasswordReset from "../Screens/PasswordReset";
import MyOrders from "../Screens/MyOrders";
import OrderStatus from "../Screens/OrderStatus";
import CartOrderPage from "../Screens/CartOrderPage";
// import OrderWebView from "./OrderWebView";

// https://www.youtube.com/watch?v=bnRIvh6NVqA

function AuthNavigation() {
  const authHandler = useUpdateAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDark,setIsDark]=React.useState(false);

  // const isDark = useTheme();
  // // const [isDark,setIsDark]=useState(false);
  // const themeHandler = useUpdateTheme();

  const getAuthToken = async () => {
    try {
      const value = await AsyncStorage.getItem("AUTH_TOKEN");
      const type = await AsyncStorage.getItem("USER_TYPE");

      {
        value !== null ? authHandler(true,type=="true"?true:false) : authHandler(false,type=="true"?true:false);
      }
      setIsLoading(false);
    } catch (e) {
      authHandler(false,type=="true"?true:false);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getAuthToken();
  }, []);

  function StackNav() {
    const Stack = createNativeStackNavigator();
    const { isLogedin, isAdmin } = useAuth();
    return (
      //turned off the title header  using screenOptions and set LoginPage as the landing page
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* if you need to create a new screen, create inside Screens folder and add the screen to below lines */}

        {isLogedin && !isAdmin ? (
          <>
            <Stack.Screen name="Draw" component={DrawerNav} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="CategoryViewPage" component={Category} />
            <Stack.Screen
              name="HomeCategoryItem"
              component={HomeCaregoryItem}
              />
            <Stack.Screen name="ProductView" component={ProductViewScreen} />
            <Stack.Screen name="OrderScreen" component={OrderPage} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="OrderReview" component={OrderReview} />
            <Stack.Screen name="MyCart" component={Cart} />
            <Stack.Screen name="SearchScreens" component={SearchScreen} />
            <Stack.Screen name="AddAddressScreen" component={AddAddress} />
            <Stack.Screen name="UserProfileScreen" component={UserProfile} />
            <Stack.Screen name="myAddress" component={MyAddress} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
            <Stack.Screen name="myFavs" component={MyFavourites} />
            <Stack.Screen name="myOrders" component={MyOrders} />
            <Stack.Screen name="PasswordRest" component={PasswordReset} />
            <Stack.Screen name="OrderStatus" component={OrderStatus} />
            <Stack.Screen name="CartOrderPage" component={CartOrderPage} />
              {/* 
            <Stack.Screen name="TestScreen" component={TestScreen} />
            <Stack.Screen name="wheel" component={LuckeySpinner} />
            <Stack.Screen name="orderWeb" component={OrderWebView} /> */}
          </>
        ) : isLogedin && isAdmin ? (
          <>
            <Stack.Screen name="AdminHomePage" component={AdminHome} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
          </>
        ) : (
          <>
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="SignIn" component={Register} />
            <Stack.Screen name="OTPVeri" component={OtpVerificationScreen} />
          </>
        )}
      </Stack.Navigator>
    );
  }

  function DrawerNav() {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();

    return (
      <Drawer.Navigator
        initialRouteName="HomePage"
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? "#7c0a0a" : "white" },
          headerTitle: "E-Buy Lk",
          headerTitleAlign: "center",
          headerTintColor: isDark ? "white" : "black",
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <Icon2
                  name="shopping-cart"
                  size={20}
                  color={isDark ? "white" : "black"}
                  onPress={() => {
                    navigation.navigate("My Cart");
                  }}
                  style={{ marginRight: 10 }}
                />
                <Icon2
                  name="user"
                  size={20}
                  color={isDark ? "white" : "black"}
                  onPress={() => {
                    navigation.navigate("UserProfileScreen");
                  }}
                  style={{ marginRight: 10, marginLeft: 5 }}
                />
              </View>
            );
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomePage} />
        <Drawer.Screen name="My Cart" component={Cart} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isLoading ? <Text></Text> : <StackNav />}
    </NavigationContainer>
  );
}

export default AuthNavigation;

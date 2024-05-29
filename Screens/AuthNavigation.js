import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
// import {LoginPage} from './components/LoginPage';
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
  NavigationActions,
  
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginPage from "./LoginPage";
import Register from "./Register";
import HomePage from "./HomePage";
import Cart from "./Cart";
import Category from "./Category";

import HomeCaregoryItem from "./HomeCaregoryItem";
import * as React from "react";
import {
  useAuth,
  useUpdateAuth,
} from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductViewScreen from "./ProductViewScreen";
import SearchScreen from "./SearchScreen";
import Icon2 from 'react-native-vector-icons/Feather';
import { useTheme,useUpdateTheme } from "./ThemeContext";
import Theme from "./Theme";


// https://www.youtube.com/watch?v=bnRIvh6NVqA

function AuthNavigation() {
  const authHandler = useUpdateAuth();
  const [isLoading,setIsLoading]=React.useState(true);
  

  const isDark=useTheme();
  // const [isDark,setIsDark]=useState(false);
  const themeHandler=useUpdateTheme();

  const getAuthToken = async () => {
    try {
        const value = await AsyncStorage.getItem('AUTH_TOKEN');
        {value !== null? authHandler(true):authHandler(false)}
        setIsLoading(false);
      } catch (e) {
        authHandler(false);
        setIsLoading(false);
      }
  };

  React.useEffect((()=>{
        getAuthToken();
    }),[]);

  function StackNav() {
    const Stack = createNativeStackNavigator();
    const isLogedin = useAuth();
    return (
      //turned off the title header  using screenOptions and set LoginPage as the landing page
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* if you need to create a new screen, create inside Screens folder and add the screen to below lines */}

        {isLogedin ? (
          <>
            <Stack.Screen name="Draw" component={DrawerNav} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="CategoryViewPage" component={Category} />
            <Stack.Screen name="HomeCategoryItem" component={HomeCaregoryItem} />
            <Stack.Screen name="ProductView" component={ProductViewScreen}/>
            <Stack.Screen name="MyCart" component={Cart} />
            <Stack.Screen name="SearchScreens" component={SearchScreen}/>
          </>
        ) : (
          <>
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="SignIn" component={Register} />
          </>
        )}
      </Stack.Navigator>
    );
  }

  function DrawerNav() {
    const Drawer = createDrawerNavigator();
    const navigation=useNavigation();
  
    return (
      <Drawer.Navigator
        initialRouteName="HomePage"
        screenOptions={{
          headerStyle: {backgroundColor:isDark?"#7c0a0a":"white",},
          headerTitle: "E-Buy Lk",
          headerTitleAlign: "center",
          headerTintColor:isDark?"white":"black",
          headerRight:()=>{ return (<Icon2 name="shopping-cart" size={20}  color={isDark?"white":"black"} onPress={()=>{navigation.navigate("My Cart")}} style={{marginRight:10}}/>)}
        }}
      >
        <Drawer.Screen name="Home" component={HomePage} />
        <Drawer.Screen name="My Cart" component={Cart} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isLoading?
      <Text></Text>
      :
      <StackNav />
      }
    </NavigationContainer>
  );
}

export default AuthNavigation;

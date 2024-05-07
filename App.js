import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import {LoginPage} from './components/LoginPage';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/FontAwesome";

import LoginPage from './Screens/LoginPage';
import Register from './Screens/Register';
import HomePage from './Screens/HomePage';
import Cart from './Screens/Cart';
import Category from './Screens/Category';
import HomeCaregoryItem from './Screens/HomeCaregoryItem';





const StackNav=()=>{
  const Stack=createNativeStackNavigator();
  
  return(

    //turned off the title header  using screenOptions and set LoginPage as the landing page
      <Stack.Navigator initialRouteName='LoginPage' 
      screenOptions={{
        headerShown:false,

      }}
      >
        {/* if you need to create a new screen, create inside Screens folder and add the screen to below lines */}
        <Stack.Screen name='LoginPage' component={LoginPage} />
        <Stack.Screen name='SignIn' component={Register}/>
        <Stack.Screen name='HomePage' component={DrawerNav}/>
        <Stack.Screen name='CategoryViewPage' component={Category}/>
        <Stack.Screen name="HomeCategoryItem" component={HomeCaregoryItem}/>
      </Stack.Navigator>
  )
}


const DrawerNav=()=>{
  const Drawer = createDrawerNavigator();
  const navigation=useNavigation();
  return(
      <Drawer.Navigator screenOptions={{
        // statusBarColor: '#0163d2',
        headerStyle: {
          // backgroundColor: '#0163d2',
        },
        headerTitle:'E-Buy Lk',
        // headerTintColor: '#fff',
        headerTitleAlign: 'center',
        // headerLeft:()=>{
        //   return(
        //     <Icon style={styles.topIcons} onPress={()=>navigation.dispatch(DrawerActions.openDrawer())} name="bars" size={30} color="#000" />
        //   )
        // }
      }}>
        <Drawer.Screen name="Home" component={HomePage}/>

        <Drawer.Screen name="My Cart" component={Cart}/>
        
      </Drawer.Navigator>
  )
}
export default function App() {
  return (
    //navigation through screens
    <NavigationContainer>
      {/* <DrawerNav/> */}
      <StackNav/>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

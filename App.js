import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import {LoginPage} from './components/LoginPage';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginPage from './Screens/LoginPage';
import Register from './Screens/Register';
import HomePage from './Screens/HomePage';

const Stack=createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginPage' screenOptions={{headerShown:false}}>
        <Stack.Screen name='LoginPage' component={LoginPage}/>
        <Stack.Screen name='SignIn' component={Register}/>

        <Stack.Screen name='HomePage' component={HomePage}/>
      </Stack.Navigator>
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

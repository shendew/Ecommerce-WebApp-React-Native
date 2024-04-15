import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import {LoginPage} from './components/LoginPage';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginPage from './components/LoginPage';
import Register from './components/Register';

const Stack=createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginPage' screenOptions={{headerShown:false}}>
        <Stack.Screen name='LoginPage' component={LoginPage}/>
        <Stack.Screen name='SignIn' component={Register}/>
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

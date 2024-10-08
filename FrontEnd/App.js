import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Components/HomeFage/Home';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }} 
          /> 
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} 
        /> 
          <Stack.Screen name="SignUp" component={SignUp}  options={{ headerShown: false }} 
          />  
         
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

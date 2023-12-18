import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QRScanner from '../components/QRScanner';
import VerifyDeviceScreen from '../components/VerifyDeviceScreen';
import VerifyEmailScreen from '../components/VerifyEmailScreen';
import CheckInOutScreen from '../components/CheckInOutScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QRScanner">
        <Stack.Screen name="QRScanner" component={QRScanner} />
        <Stack.Screen name="VerifyDevice" component={VerifyDeviceScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="CheckInOut" component={CheckInOutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

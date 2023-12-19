// WelcomeScreen.js
import React, {useState} from 'react';
import { View, Button,StyleSheet, Text, TouchableOpacity, } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const navigateToQRScanner = () => {
    navigation.navigate('QRScanner');
  };

  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.container}>
      <Text>Welcome to our v8 App!</Text>
      <View style ={{margin:10}}/>
      {/* <Button title="Scan QR Code" onPress={navigateToQRScanner} /> */}
      <TouchableOpacity style={styles.button}  onPress={navigateToQRScanner}>
        <Text>Scan QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      alignItems: 'center'
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
  });
  
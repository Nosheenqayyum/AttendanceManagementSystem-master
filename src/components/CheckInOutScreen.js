import React from 'react';
import { View, Text, Button } from 'react-native';
import { checkInOut } from '../services/api';

const CheckInOutScreen = () => {
  const handleCheckInOut = async () => {
    try {
      const response = await checkInOut();
      if (response.success) {
        // Handle successful check in/out
      } else {
        // Handle check in/out error
      }
    } catch (error) {
      console.error('Error checking in/out:', error);
    }
  };

  return (
    <View>
      <Text>Check In/Out Screen</Text>
      <Button title="Check In/Out" onPress={handleCheckInOut} />
    </View>
  );
};

export default CheckInOutScreen;

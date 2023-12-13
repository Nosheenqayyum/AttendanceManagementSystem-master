import NetInfo from '@react-native-community/netinfo';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { checkInOut, fetchUserEmails, verifyDevice, verifyEmail } from '../services/api';
import DeviceInfo from 'react-native-device-info';


const VerifyEmailScreen = ({ navigation }) => {
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailList, setEmailList] = useState([]);
  const [bssid, setBssid] = useState(null);
  const deviceId = DeviceInfo.getUniqueId();


  console.log('Device UUID:', deviceId)

  useEffect(() => {

  // this is to get bssid then set to state 
    NetInfo.fetch().then(state => {
      // console.log("Details", state.details.bssid);
      setBssid( state.details.bssid); 
    });  
    // Fetch the list of emails when the component mounts
    fetchEmails();

  }, []);

  const fetchEmails = async () => {
    try {
      // Replace 'B4-69-21-76-35-68' with the actual MAC address or use the one you get from somewhere
      const response = await fetchUserEmails(bssid);
      console.log(bssid)
      setEmailList(response?.body); // Assuming the API response is an array of emails
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  

  const handleVerifyEmail = async () => {
    try {
      // Check if an email is selected
      if (selectedEmail) {
        const verifyEmailResponse = await verifyEmail(selectedEmail,deviceId);
        if (verifyEmailResponse.success) {
          const verifyDeviceResponse = await verifyDevice(selectedEmail);
          if (verifyDeviceResponse.header.status === 200) {
            // Device is verified, automatically check in/out
            const checkInOutResponse = await checkInOut(selectedEmail);
            if (checkInOutResponse.header.status === 200) {
              setEmailVerified(true);
              navigation.navigate('CheckInOut');
            } else {
              // Handle check-in/out error
              console.error('Error during check-in/out process:', checkInOutResponse.header.message);
            }
          } else {
            // Handle unauthorized device
            console.error('Unauthorized device:', verifyDeviceResponse.header.message);
          }
        } else {
          // Handle email verification error
          console.error('Error verifying email:', verifyEmailResponse.message);
        }
      } else {
        // No email selected, show an alert or handle accordingly
        // For now, let's just log a message
        console.warn('Please select an email before verifying.');
      }
    } catch (error) {
      console.error('Error in verification process:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Verify Email Screen</Text>
      <Picker
        selectedValue={selectedEmail}
        onValueChange={(itemValue) => setSelectedEmail(itemValue)}
      >
        <Picker.Item label="Select an email" value={null} />
        {emailList.map((emailItem) => (
          <Picker.Item key={emailItem._id} label={emailItem.email} value={emailItem.email} />
        ))}
      </Picker>
      {!isEmailVerified && (
        <Button
          title="Verify Email"
          onPress={handleVerifyEmail}
          disabled={!selectedEmail}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  }, 
});

export default VerifyEmailScreen;

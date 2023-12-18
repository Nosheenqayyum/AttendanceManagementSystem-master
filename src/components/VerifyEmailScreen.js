import NetInfo from "@react-native-community/netinfo";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import {
  checkInOut,
  fetchUserEmails,
  verifyDevice,
  verifyEmail,
} from "../services/api";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const VerifyEmailScreen = ({ navigation }) => {
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailList, setEmailList] = useState([]);
  const [bssid, setBssid] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    // this is to get bssid then set to state
    NetInfo.fetch().then((state) => {
      // console.log("Details", state.details.bssid);
      setBssid(state.details.bssid);
    });
    // Fetch the list of emails when the component mounts
    fetchEmails();
    getDeviceId();
  }, []);

  const getDeviceId = async () => {
    let uuid = uuidv4();
    let fetchUUID = await SecureStore.getItemAsync("secure_deviceId");
    //if user has already signed up prior
    if (fetchUUID) {
      uuid = fetchUUID;
      setDeviceId(uuid);
      return;
    }
    await SecureStore.setItemAsync("secure_deviceId", JSON.stringify(uuid));
    setDeviceId(uuid);
  };

  const fetchEmails = async () => {
    try {
      // Replace 'B4-69-21-76-35-68' with the actual MAC address or use the one you get from somewhere
      const response = await fetchUserEmails(bssid);
      setEmailList(response?.body); // Assuming the API response is an array of emails
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  const showResponseError = (error) => {
    if (error.message === "Network Error") {
      return "Please check your network";
    } else {
      if (error.response) {
        const errorCode = error.response.status.toString();
        const responseData = error.response.data;
        // console.log(responseData,errorCode) // check error by console
        switch (errorCode) {
          case "400":
            return responseData.data || responseData.header.message;
          case "401":
            // Navigate to VerifyEmail screen or another appropriate screen
            // navigation.navigate('VerifyEmail');
            return responseData.header.message;
          case "405":
            return "API method not allowed!";
          case "404":
            return responseData.header.message || "API not found!";
          default:
            return responseData.header.message || "An error occurred.";
        }
      } else {
        return "An error occurred.";
      }
    }
  };

  const handleVerifyEmail = async () => {
    try {
      // Check if an email is selected
      if (selectedEmail) {
        const data = {
          email: selectedEmail,
          macAddress: bssid,
          deviceId: deviceId,
        };
        const verifyEmailResponse = await verifyEmail(data);
        console.log(verifyEmailResponse);
        if (verifyEmailResponse.header.status === 200) {
          Alert.alert("Success", verifyEmailResponse.header.message);
          // Device is verified, automatically check in/out
          // const checkInOutResponse = await checkInOut(deviceId, bssid);
          // console.log(checkInOutResponse);
          // if (checkInOutResponse.header.status === 200) {
          //   setEmailVerified(true);
          //   if (checkInOutResponse.header.status === 200) {
          // Alert.alert("Success", checkInOutResponse.header.message);
          //   }
          navigation.navigate("QRScanner");
          // } else {
          //   // Handle check-in/out error
          //   console.error(
          //     "Error during check-in/out process:",
          //     checkInOutResponse.header.message
          //   );
          // }
        } else {
          // Handle email verification error
          console.error("Error verifying email:", verifyEmailResponse.message);
        }
      } else {
        // No email selected, show an alert or handle accordingly
        // For now, let's just log a message
        console.warn("Please select an email before verifying.");
      }
    } catch (error) {
      console.log(error);
      let err = showResponseError(error);
      console.log(err, "here");
      Alert.alert("Error", err);
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
          <Picker.Item
            key={emailItem._id}
            label={emailItem.email}
            value={emailItem.email}
          />
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

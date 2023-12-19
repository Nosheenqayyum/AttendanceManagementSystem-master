import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { verifyDevice, checkInOut } from "../services/api";
import NetInfo from "@react-native-community/netinfo";

const VerifyDeviceScreen = ({ navigation, route }) => {
  const deviceId = route.params.deviceId;

  const [isDeviceVerified, setDeviceVerified] = useState(false);
  const [bssid, setBssid] = useState(null);

  const showResponseError = (error) => {
    console.log(error,"in verify device")
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
            navigation.navigate("VerifyEmail");
            return responseData.header.message;
          case "405":
            return "API method not allowed!";
          case "404":
            return responseData.header.message || "Api not found !";
          default:
            return responseData.header.message || "An error occurred.";
        }
      } else {
        return "An error occurred.";
      }
    }
  };

  useEffect(() => {
    // this is to get bssid then set to state
    NetInfo.fetch().then((state) => {
      // console.log("Details", state.details.bssid);
      // setBssid(state.details.bssid);
      verifyAndCheckInOut(state.details.bssid);
      console.log(bssid);
    });
    

    
  }, [deviceId, navigation]);


  const verifyAndCheckInOut = async (bssid) => {
    try {
      const verificationResponse = await verifyDevice(deviceId, bssid);
      console.log("verificationResponse", verificationResponse);

      if (verificationResponse.header.status === 200) {
        // Device is verified, automatically check in/out
        setDeviceVerified(true);
        const checkInOutResponse = await checkInOut(deviceId, bssid);
        console.log("checkInOutResponse", checkInOutResponse);
        if (checkInOutResponse.header.status === 200) {
          Alert.alert("Success", checkInOutResponse.header.message);
        }
      }
    } catch (error) {
      let err = showResponseError(error);
      console.log(err, "here");
      Alert.alert("Error", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* {!isDeviceVerified && (
                <Button title="Verify Device" onPress={handleVerifyDevice} />
            )} */}
    </View>
  );
};

export default VerifyDeviceScreen;

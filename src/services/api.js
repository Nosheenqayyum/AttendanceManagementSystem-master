import axios from 'axios';

const BASE_URL = 'http://172.16.172.170:9564'; // need to replace for prod

export const verifyDevice = async (deviceId,macAddress) => {
  console.log("api data for verify device call in api.js",deviceId,macAddress)
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/device/verify`,{
      // Request body parameters
      deviceId: deviceId,
    },
    {
      // Query parameters
      macAddress: macAddress,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (data) => {
  try {
    const { macAddress, email, deviceId } = data;
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/email/verify`,
      {
        // Request body parameters
        email: email,
        deviceId: deviceId,
      },
      {
        // Query parameters
        params: {
          macAddress: macAddress,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkInOut = async (deviceId, macAddress) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/user/check`,
      {
        // Request body parameters
        deviceId: deviceId,
      },
      {
        // Query parameters
        macAddress: macAddress,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserEmails = async (macAddress) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/auth/user/emails`, {
      params: {
        macAddress: macAddress,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


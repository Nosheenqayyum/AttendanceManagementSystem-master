import axios from 'axios';

const BASE_URL = 'http://172.16.172.99:9564'; // need to replace for prod

export const verifyDevice = async (deviceId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/device/verify`, {
      deviceId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/email/verify`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkInOut = async (deviceId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/user/check`, {
        deviceId,
      });
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
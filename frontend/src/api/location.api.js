import client from './client';

export const getLocationByPincode = async (pincode) => {
    // Expecting backend to return { city, area, pincode } or a list of locations
    const response = await client.get(`/locations/pincode/${pincode}`);
    return response.data;
};

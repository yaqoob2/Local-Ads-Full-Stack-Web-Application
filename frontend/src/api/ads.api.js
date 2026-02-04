import client from './client';

export const getMyAds = async () => {
    const response = await client.get('/ads/myads');
    return response.data;
};

export const getAds = async (filters = {}) => {
    // Map frontend filter naming to backend query params
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('keyword', filters.search);
    if (filters.city) params.append('city', filters.city); // Assuming backend supports this or filters locally? Backend code showed text search on keyword.
    // If backend doesn't support city/pincode in top-level, we rely on keyword search or client side filtering for now, 
    // but User requirements said "Must send query params: city, pincode".
    // I will append them in case the backend is updated to support them.
    if (filters.city) params.append('city', filters.city);
    if (filters.pincode) params.append('pincode', filters.pincode);

    const response = await client.get(`/ads?${params.toString()}`);
    return response.data;
};

export const getAdById = async (id) => {
    const response = await client.get(`/ads/${id}`);
    return response.data;
};

export const createAd = async (adData) => {
    const response = await client.post('/ads', adData);
    return response.data;
};

export const deleteAd = async (id) => {
    const response = await client.delete(`/ads/${id}`);
    return response.data;
};

export const trackAdClick = async (id, type) => {
    const response = await client.put(`/ads/${id}/click`, { type });
    return response.data;
};

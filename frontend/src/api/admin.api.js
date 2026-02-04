import client from './client';

export const getPendingAds = async () => {
    const response = await client.get('/admin/ads/pending');
    return response.data;
};

export const updateAdStatus = async (id, status, reason = '') => {
    // status: 'APPROVED' or 'REJECTED'
    const payload = { status };
    if (reason) payload.reason = reason;

    const response = await client.put(`/admin/ads/${id}/status`, payload);
    return response.data;
};

export const getUsers = async () => {
    const response = await client.get('/admin/users');
    return response.data;
};

export const banUser = async (id) => {
    const response = await client.put(`/admin/users/${id}/ban`);
    return response.data;
};

export const getAllAds = async () => {
    const response = await client.get('/admin/ads');
    return response.data;
};

export const activateSubscription = async (userId, planId, durationInDays) => {
    const response = await client.post('/admin/subscriptions/activate', { userId, planId, durationInDays });
    return response.data;
};

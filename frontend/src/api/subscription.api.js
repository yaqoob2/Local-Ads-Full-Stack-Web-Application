import client from './client';

export const getPlans = async () => {
    const response = await client.get('/subscription/plans');
    return response.data;
};

export const createSubscription = async () => {
    // Current backend implementation might not take arguments if there's only one active plan logic or if it auto-assigns
    // But typically we'd pass a planId. Based on typical patterns:
    const response = await client.post('/subscription');
    return response.data;
};

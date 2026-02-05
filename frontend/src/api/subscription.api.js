import client from './client';

export const getPlans = async () => {
    const response = await client.get('/subscription/plans');
    return response.data;
};

export const createSubscription = async (planId) => {
    const response = await client.post('/subscription', { planId });
    return response.data;
};

export const createStripeSubscriptionSession = async (planId) => {
    const response = await client.post('/subscription/stripe/create-checkout-session', { planId });
    return response.data;
};

export const getMySubscriptions = async () => {
    const response = await client.get('/subscription/my-history');
    return response.data;
};

export const cancelSubscription = async () => {
    const response = await client.post('/subscription/cancel');
    return response.data;
};

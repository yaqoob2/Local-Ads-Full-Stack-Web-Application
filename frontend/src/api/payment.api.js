import client from './client';

export const addCard = async (cardData) => {
    const response = await client.post('/payments/cards', cardData);
    return response.data;
};

export const getCards = async () => {
    const response = await client.get('/payments/cards');
    return response.data;
};

export const createStripeSession = async (adId) => {
    const response = await client.post('/payments/stripe/create-checkout-session', { adId });
    return response.data;
};

export const getPaymentStatus = async (adId) => {
    const response = await client.get(`/payments/status/${adId}`);
    return response.data;
};

import client from './client';

export const login = async (identifier, password) => {
    // Expecting backend to accept { login, password }
    const response = await client.post('/auth/login', { login: identifier, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await client.post('/auth/register', userData);
    return response.data;
};

export const getProfile = async () => {
    const response = await client.get('/auth/profile');
    return response.data;
};

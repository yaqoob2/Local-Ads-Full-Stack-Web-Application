import client from './client';

export const getCategories = async () => {
    const response = await client.get('/meta/categories');
    return response.data;
};

export const getTemplates = async () => {
    const response = await client.get('/meta/templates');
    return response.data;
};

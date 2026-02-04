import axios from 'axios';

const client = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem('token');
                // Only try refresh if we actually had a token (avoid infinite loops on public pages)
                if (token) {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
                        { token }
                    );

                    if (response.data && response.data.token) {
                        localStorage.setItem('token', response.data.token);

                        // Update header for original request
                        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                        return client(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed - clean up and redirect
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default client;

import api from '../api/axios';

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (userData) => {
    // userData: { name, email, password, role }
    const response = await api.post('/auth/register', userData);
    return response.data;
};

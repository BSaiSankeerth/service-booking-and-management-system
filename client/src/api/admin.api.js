import api from '../api/axios';

export const getAllPartners = async () => {
    const response = await api.get('/admin/partners');
    // API might return just array, or object with data
    return response.data;
};

export const verifyPartner = async (partnerId) => {
    const response = await api.patch(`/admin/partners/${partnerId}/verify`);
    return response.data;
};

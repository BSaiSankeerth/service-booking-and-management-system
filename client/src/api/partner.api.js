import api from '../api/axios';

// Profile
export const getPartnerProfile = async () => {
    const response = await api.get('/partner/profile/me');
    return response.data;
};

export const updatePartnerProfile = async (profileData) => {
    const response = await api.post('/partner/profile', profileData);
    return response.data;
};

// Services
export const getMyServices = async () => {
    const response = await api.get('/services/my');
    return response.data;
};

export const createService = async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
};

// Bookings
export const getPartnerBookings = async () => {
    const response = await api.get('/bookings/partner');
    return response.data;
};

export const updateBookingStatus = async (id, status) => {
    // status: 'approved' | 'rejected'
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
};

export const completeBooking = async (id) => {
    const response = await api.patch(`/bookings/${id}/complete`);
    return response.data;
};

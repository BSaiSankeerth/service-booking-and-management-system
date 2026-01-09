import api from '../api/axios';

export const getAllServices = async () => {
    const response = await api.get('/services');
    return response.data;
};

export const createBooking = async (serviceId, bookingDetails) => {
    // bookingDetails might contain date, time, etc.
    const response = await api.post('/bookings', { serviceId, ...bookingDetails });
    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get('/bookings/my');
    return response.data;
}

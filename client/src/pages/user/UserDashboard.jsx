import { useState, useEffect } from 'react';
import { getAllServices, createBooking, getMyBookings } from '../../api/user.api';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // Booking Modal State
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [servicesData, bookingsData] = await Promise.all([
                getAllServices(),
                getMyBookings()
            ]);
            setServices(servicesData);
            setBookings(bookingsData);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const openBookingModal = (service) => {
        setSelectedService(service);
        setBookingDate('');
        setStartTime('');
        setBookingError('');
        setIsModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const submitBooking = async (e) => {
        e.preventDefault();
        setBookingError('');

        if (!bookingDate || !startTime) {
            setBookingError("All fields are required");
            alert("All fields are required");
            return;
        }

        try {
            await createBooking(selectedService._id, { bookingDate, startTime });
            alert('Booking successful! Partner successfully allocated.');
            closeBookingModal();
            fetchData(); // Refresh list
        } catch (error) {
            const msg = error.response?.data?.message || 'Booking failed';
            if (error.response?.status === 409) {
                setBookingError("Partner is busy at this time. Please choose another slot.");
                alert("Partner is busy at this time.");
            } else {
                setBookingError(msg);
                alert(msg);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">User Dashboard</h1>
                            <span className="ml-4 text-gray-500">Welcome, {user?.name}</span>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                {/* Services Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Available Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500 text-lg">No services available yet.</p>
                            </div>
                        ) : (
                            services.map(service => (
                                <div key={service._id} className="flex flex-col bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
                                    <div className="h-48 w-full bg-gray-200 relative">
                                        <img src="/service-card.png" alt={service.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg font-bold">
                                            ${service.price}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title || service.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-3">{service.description}</p>
                                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {service.duration ? `${service.duration} mins` : 'Flexible duration'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openBookingModal(service)}
                                            className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Bookings Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {bookings.length === 0 ? (
                                <li className="px-4 py-4 text-center">No bookings found.</li>
                            ) : (
                                bookings.map(booking => (
                                    <li key={booking._id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-indigo-600 truncate">
                                                {booking.service?.name || "Service"}
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Date: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : booking.date}
                                                </p>
                                                <p className="flex items-center text-sm text-gray-500 ml-4">
                                                    Time: {booking.startTime}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </section>

            </main>

            {/* Models */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Book Service: {selectedService?.name}</h3>
                        <form onSubmit={submitBooking} className="space-y-4">
                            {bookingError && <p className="text-red-500 text-sm">{bookingError}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input
                                    type="time"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={closeBookingModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserDashboard;

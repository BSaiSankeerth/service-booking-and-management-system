import { useState, useEffect } from 'react';
import {
    getPartnerProfile, updatePartnerProfile,
    getMyServices, createService,
    getPartnerBookings, updateBookingStatus, completeBooking
} from '../../api/partner.api';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const PartnerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // bookings, services, profile

    // Data States
    const [profile, setProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);

    // Form States
    const [serviceForm, setServiceForm] = useState({ title: '', description: '', price: '', duration: '' });
    const [profileForm, setProfileForm] = useState({
        skills: '', experience: '', location: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            try {
                const p = await getPartnerProfile();
                setProfile(p);
                if (p) setProfileForm({
                    skills: p.skills ? p.skills.join(', ') : '',
                    experience: p.experience || '',
                    location: p.location || ''
                });
            } catch (e) { console.log('No profile found or error', e); }

            const s = await getMyServices();
            setServices(s);

            const b = await getPartnerBookings();
            setBookings(b);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            await createService(serviceForm);
            setServiceForm({ title: '', description: '', price: '', duration: '' });
            const s = await getMyServices();
            setServices(s);
            alert('Service created');
        } catch (err) {
            console.error(err);
            alert('Failed to create service: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            // Convert skills string to array
            const payload = {
                ...profileForm,
                skills: profileForm.skills.split(',').map(s => s.trim()).filter(s => s)
            };
            const updated = await updatePartnerProfile(payload);
            setProfile(updated);
            alert('Profile updated');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            fetchData(); // Refresh
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleComplete = async (id) => {
        try {
            await completeBooking(id);
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded shadow">
                    <div>
                        <h1 className="text-2xl font-bold">Partner Dashboard</h1>
                        {profile ? <p className="text-gray-500">Verified: {profile.isVerified ? 'Yes' : 'No'}</p> : <p className="text-red-500">Please complete your profile!</p>}
                    </div>
                    <button onClick={handleLogout} className="text-red-600">Logout</button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 bg-white p-4 rounded shadow">
                    <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}>Bookings</button>
                    <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded ${activeTab === 'services' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}>My Services</button>
                    <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}>Profile</button>
                </div>

                {/* Content */}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Incoming Bookings</h2>
                        <ul className="divide-y divide-gray-200">
                            {bookings.length === 0 ? <p>No bookings yet.</p> : bookings.map(b => (
                                <li key={b._id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{b.service?.name} - {b.date}</p>
                                        <p className="text-sm text-gray-500">User: {b.user?.name} ({b.user?.email})</p>
                                        <p className={`text-sm font-bold ${b.status === 'completed' ? 'text-green-600' : b.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            Status: {b.status}
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        {b.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusChange(b._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                                                <button onClick={() => handleStatusChange(b._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                                            </>
                                        )}
                                        {b.status === 'approved' && (
                                            <button onClick={() => handleComplete(b._id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Mark Completed</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div className="space-y-6">
                        {/* Create Service */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-bold mb-4">Add New Service</h3>
                            <form onSubmit={handleCreateService} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input required placeholder="Service Title" className="border p-2 rounded" value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} />
                                <input required type="number" placeholder="Price" className="border p-2 rounded" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} />
                                <input required type="number" placeholder="Duration (min)" className="border p-2 rounded" value={serviceForm.duration} onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })} />
                                <textarea required placeholder="Description" className="border p-2 rounded sm:col-span-2" value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
                                <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 sm:col-span-2">Create Service</button>
                            </form>
                        </div>

                        {/* List Services */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-bold mb-4">My Services</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {services.map(s => (
                                    <div key={s._id} className="border p-4 rounded flex justify-between">
                                        <div>
                                            <h4 className="font-bold">{s.title || s.name}</h4>
                                            <p className="text-gray-600">{s.description}</p>
                                            <p className="text-indigo-600">${s.price} - {s.duration} min</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white p-6 rounded shadow max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">Partner Profile</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                                <input required placeholder="Plumbing, Electrician, etc" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" value={profileForm.skills} onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                                <input required type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" value={profileForm.experience} onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Save Profile</button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PartnerDashboard;

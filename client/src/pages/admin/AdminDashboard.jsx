import { useState, useEffect } from 'react';
import { getAllPartners, verifyPartner } from '../../api/admin.api';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const data = await getAllPartners();
            setPartners(data);
        } catch (error) {
            console.error("Failed to fetch partners", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        if (!window.confirm("Are you sure you want to verify this partner?")) return;
        try {
            await verifyPartner(id);
            fetchPartners(); // Refresh list
        } catch (error) {
            alert("Verification failed");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-red-600">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4">Admin: {user?.name}</span>
                            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Manage Partners</h2>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {partners.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">No partners found.</td></tr>
                            ) : (
                                partners.map(partner => (
                                    <tr key={partner._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{partner.user?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{partner.skills?.join(', ') || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{partner.location || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${partner.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {partner.isVerified ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {!partner.isVerified && (
                                                <button onClick={() => handleVerify(partner._id)} className="text-indigo-600 hover:text-indigo-900">Verify</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/auth.api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' // Default to user, maybe allow partner selection?
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (

        <div className="flex min-h-screen bg-white">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-50 items-center justify-center p-12">
                <div className="max-w-lg">
                    <img src="/auth-bg.png" alt="Illustration" className="w-full h-auto object-contain" />
                    <h2 className="mt-8 text-3xl font-bold text-gray-800">Join Our Community</h2>
                    <p className="mt-4 text-lg text-gray-600">Create an account to offer services or find the help you need.</p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Create new account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in to existing account</Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="mt-1">
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1">
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">I want to...</label>
                                <div className="mt-1">
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="user">Book Services</option>
                                        <option value="partner">Offer Services (Partner)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

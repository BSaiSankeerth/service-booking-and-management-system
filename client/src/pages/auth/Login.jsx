// Login Component
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { loginUser } from '../../api/auth.api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData.email, formData.password);
            if (data.token) {
                login(data.token, data.user);

                // If coming from login page directly, redirect based on role
                let target = from;
                if (target === '/' || target === '/login') {
                    if (data.user?.role === 'admin') target = '/admin-dashboard';
                    else if (data.user?.role === 'partner') target = '/partner-dashboard';
                    else target = '/user-dashboard'; // default user
                }
                navigate(target, { replace: true });
            } else {
                setError('Login failed: No token received');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-50 items-center justify-center p-12">
                <div className="max-w-lg">
                    <img src="/auth-bg.png" alt="Illustration" className="w-full h-auto object-contain" />
                    <h2 className="mt-8 text-3xl font-bold text-gray-800">Connect with Expert Partners</h2>
                    <p className="mt-4 text-lg text-gray-600">Find and book professional services seamlessly with our platform.</p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">create a new account</Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Email address </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Password </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


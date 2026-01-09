import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';

import UserDashboard from './pages/user/UserDashboard';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* User Routes */}
                    <Route element={<ProtectedRoute><RoleRoute allowedRoles={['user']}><UserDashboard /></RoleRoute></ProtectedRoute>} path="/user-dashboard" />

                    {/* Partner Routes */}
                    <Route element={<ProtectedRoute><RoleRoute allowedRoles={['partner']}><PartnerDashboard /></RoleRoute></ProtectedRoute>} path="/partner-dashboard" />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute></ProtectedRoute>} path="/admin-dashboard" />

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return children;
};

RoleRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-custom-black text-custom-yellow">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-yellow"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !user.role.some(role => roles.includes(role))) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

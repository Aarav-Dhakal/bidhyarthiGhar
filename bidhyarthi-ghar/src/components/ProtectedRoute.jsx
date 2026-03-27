import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles: array of roles that can access this route
// e.g. allowedRoles={['admin']} or allowedRoles={['student', 'landlord']}
export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        // Not logged in → send to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role → send to their correct dashboard
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'landlord') return <Navigate to="/landlord" replace />;
        if (user.role === 'student') return <Navigate to="/dashboard" replace />;
    }

    return children;
}
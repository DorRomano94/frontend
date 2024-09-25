import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authStore from '../stores/authStore';
import CustomLayout from './CustomLayout';

const PrivateRoute: React.FC = () => {
    return authStore.isAuthenticated ? (
        <CustomLayout>
            <Outlet />
        </CustomLayout>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;

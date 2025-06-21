import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const getUser = () => {
  try {
    // Check for driver data first
    const driverData = localStorage.getItem('driverData');
    if (driverData) {
      const driver = JSON.parse(driverData);
      return {
        ...driver,
        role: 'driver' // Ensure role is set for drivers
      };
    }

    // Check for regular user data
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }

    return null;
  } catch {
    return null;
  }
};

const PrivateRoute = ({ allowedRoles }) => {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For drivers, we only check if they're trying to access driver routes
  if (user.role === 'driver' && !allowedRoles.includes('driver')) {
    return <Navigate to="/driver" replace />;
  }

  // For other users, check if their role is allowed
  if (user.role !== 'driver' && allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong portal, redirect to correct dashboard
    switch (user.role) {
      case 'student':
        return <Navigate to="/user" replace />;
      case 'college':
        return <Navigate to="/college" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Allowed
  return <Outlet />;
};

export default PrivateRoute; 
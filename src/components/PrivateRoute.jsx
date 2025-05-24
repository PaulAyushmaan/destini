import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      localStorage.setItem('token', user.token);
    }
    return user;
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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong portal, redirect to correct dashboard
    switch (user.role) {
      case 'student':
        return <Navigate to="/user" replace />;
      case 'college':
        return <Navigate to="/college" replace />;
      case 'driver':
        return <Navigate to="/driver" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Allowed
  return <Outlet />;
};

export default PrivateRoute; 
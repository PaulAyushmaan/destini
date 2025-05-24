import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const PublicRoute = () => {
  const user = getUser();

  if (user) {
    // Already logged in, redirect to their dashboard
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

  // Not logged in, allow access
  return <Outlet />;
};

export default PublicRoute; 
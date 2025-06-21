import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = ({ onAfterLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      const response = await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('driverData');
      localStorage.removeItem('driverId');

      // Optionally close dropdown
      if (onAfterLogout) onAfterLogout();

      // Redirect to login page
      console.log('Logging out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 w-full text-left px-4 py-2 text-sm rounded-b-lg"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { authService } from '@/services/authService';
import { useStore } from '@/store/useStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isOnboarded = useStore((state) => state.isOnboarded);
  const isAuthenticated = authService.isAuthenticated();

  // If user is not authenticated or has not completed onboarding, redirect to root
  if (!isAuthenticated || !isOnboarded) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../../utils/tokenStorage';

export interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = tokenStorage.isAuthenticated();

  if (!isAuth) {
    // Redirect to login with return path preserved
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

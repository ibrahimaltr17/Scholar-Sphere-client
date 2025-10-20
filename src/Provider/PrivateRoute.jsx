import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Loading from '../pages/Loading/Loading';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // ✅ If still loading, show loader
  if (loading) {
    return <Loading />;
  }

  // ✅ Only redirect if not logged in AND loading is finished
  if (!user || !user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ User is logged in, show the protected route
  return children;
};

export default PrivateRoute;

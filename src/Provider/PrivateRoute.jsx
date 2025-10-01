import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // your AuthProvider path
import { Navigate, useLocation } from 'react-router';
import Loading from '../pages/Loading/Loading';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loading />; // show loader while checking auth
  }

  if (user && user.email) {
    return children; // user is logged in, show protected component
  }

  // user not logged in → redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;

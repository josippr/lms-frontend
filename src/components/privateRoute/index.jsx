import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // TODO: replace with proper async check
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setChecking(false);
  }, []);

  if (checking) {
    return <div>Loading...</div>;
  }

  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
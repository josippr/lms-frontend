import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../../service/apiService';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element }) => {
  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const isLoggedIn = useSelector((state) => state.general.isLoggedIn);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyToken(storedToken)
        .then(() => setTokenValid(true))
        .catch(() => {
          localStorage.removeItem('token');
          setTokenValid(false);
        })
        .finally(() => setChecking(false));
    } else {
      setTokenValid(false);
      setChecking(false);
    }
  }, [isLoggedIn]);

  if (checking) return <div>Loading...</div>;

  return tokenValid ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
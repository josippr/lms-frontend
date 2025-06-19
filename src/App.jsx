import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from './context/themeProvider.jsx';
import { fetchProfile } from "./service/apiService";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Header from "./components/header";

import Home from "./pages/home";
import Login from "./pages/login";

function App() {

  const dispatch = useDispatch();

  const profileLoaded = useSelector((state) => state.profile.profileLoaded);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !profileLoaded) {
      fetchProfile(token)
        .then(profile => {
          dispatch({ type: 'SET_PROFILE', payload: profile });
          dispatch({ type: 'SET_PROFILE_LOADED', payload: true });
        })
        .catch(error => {
          console.error("Failed to fetch profile:", error);
        });
    }
  }, []);

  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <ThemeProvider>
        <HeroUIProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<PrivateRoute element={<Home key="home" />} />} />
              <Route path="/login" element={<Login key="login" />} /> 
            </Routes>
          </main>
        </HeroUIProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App

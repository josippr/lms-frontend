import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from './context/themeProvider.jsx';
import { fetchProfile } from "./service/apiService";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Header from "./components/header";
import Sidebar from "./components/sidebar";

import Home from "./pages/home";
import Login from "./pages/login";
import Metrics from "./pages/metrics";

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
  }, [dispatch, profileLoaded]);

  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <ThemeProvider>
        <HeroUIProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <Login key="login" />
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="flex h-screen w-screen overflow-hidden">
                  <div className="w-[250px] h-full shrink-0 border-r border-gray-200 bg-white">
                    <Sidebar />
                  </div>
                  <div className="flex-1 relative overflow-auto bg-gray-50">
                    <Routes>
                      <Route path="/" element={<PrivateRoute element={<Home key="home" />} />} />
                      <Route path="/metrics" element={<PrivateRoute element={<Metrics key="metrics" />} />} />
                    </Routes>
                  </div>
                  <div className="fixed top-0 right-0 z-50 p-4">
                    <Header />
                  </div>
                </div>
              }
            />
          </Routes>
        </HeroUIProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

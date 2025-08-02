import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/themeProvider.jsx';
import { fetchProfile } from "./service/apiService";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Header from "./components/header";
import PrivateRoute from "./components/privateRoute";

import Home from "./pages/home";
import Login from "./pages/login";
import Metrics from "./pages/metrics";
import Profile from "./pages/profile";
import NetworkStatus from "./pages/networkStatus";
import DevicesPage from "./pages/devices";
import AlertsPage from './pages/alerts/index.jsx';
import { NotFoundPage } from './pages/404/index.jsx';

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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

  return (
    <Router>
      <ThemeProvider>
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
              <div className="flex h-auto w-auto overflow-x-hidden overflow-y-auto">
                <div className="flex h-screen w-screen overflow-hidden">
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 h-12 shrink-0">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-6" />
                        <Header />
                      </div>
                      <div className="flex-1 overflow-auto w-full">
                        <Routes>
                          <Route path="/" element={<PrivateRoute element={<Home key="home" />} />} />
                          <Route path="/metrics" element={<PrivateRoute element={<Metrics key="metrics" />} />} />
                          <Route path="/network-status" element={<PrivateRoute element={<NetworkStatus key="network-status" />} />} />
                          <Route path="/devices" element={<PrivateRoute element={<DevicesPage key="devices" />} />} />
                          <Route path="/profile" element={<PrivateRoute element={<Profile key="profile" />} />} />
                          <Route path="/alerts" element={<PrivateRoute element={<AlertsPage key="alerts" />} />} />
                          <Route path="*" element={<PrivateRoute element={<NotFoundPage key="404" />} />} />
                        </Routes>
                      </div>
                    </SidebarInset>
                  </SidebarProvider>
                </div>
                
                <div className="fixed top-0 right-0 z-50 p-4">
                  <Header />
                </div>
              </div>
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;

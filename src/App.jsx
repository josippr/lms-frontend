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
              <div className="flex h-screen w-screen overflow-hidden">
                <div className="w-full shrink-0 border-r border-gray-200 bg-white">
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <div className="flex flex-col h-full shrink-0 justify-start items-start gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-full w-full">
                        <div className="flex items-center gap-2 px-4 h-10">
                          <SidebarTrigger className="-ml-1" />
                          <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                          />
                        </div>
                        <div className="w-full h-full">
                          <Routes>
                            <Route path="/" element={<PrivateRoute element={<Home key="home" />} />} />
                            <Route path="/metrics" element={<PrivateRoute element={<Metrics key="metrics" />} />} />
                            <Route path="*" element={<PrivateRoute element={<NotFoundPage key="404" />} />} />
                          </Routes>
                        </div>
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

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from './context/themeProvider.jsx';

import Header from "./components/header";

import Home from "./pages/home";
import Login from "./pages/login";

function App() {

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

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import About from './about/About';
import Contact from './contact/Contact';
import { Login, Signup } from './login_signup';
import LoadingScreen from './loading/LoadingScreen';
import ManageAccount from './manage account/ManageAccount';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/loading/signup" element={<LoadingScreen destination="/signup" loadingText="INITIALIZING ACCOUNT CREATION" />} />
            <Route path="/loading/login" element={<LoadingScreen destination="/login" loadingText="ACCESSING AUTHENTICATION PORTAL" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<ManageAccount />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
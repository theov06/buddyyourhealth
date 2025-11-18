import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import About from './about/About';
import Contact from './contact/Contact';
import ThankYou from './contact/ThankYou';
import { Login, Signup } from './login_signup';
import GoogleCallback from './login_signup/GoogleCallback';
import LoadingScreen from './loading/LoadingScreen';
import NeuralRemindersLoading from './loading/NeuralRemindersLoading';
import HomeLoading from './loading/HomeLoading';
import GenAILoading from './loading/GenAILoading';
import ManageAccount from './manage account/ManageAccount';
import SmartReminders from './smart-reminders/SmartReminders';
import GenAI from './genai/GenAI';
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
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/loading/signup" element={<LoadingScreen destination="/signup" loadingText="INITIALIZING ACCOUNT CREATION" />} />
            <Route path="/loading/login" element={<LoadingScreen destination="/login" loadingText="ACCESSING AUTHENTICATION PORTAL" />} />
            <Route path="/loading/neural-reminders" element={<NeuralRemindersLoading />} />
            <Route path="/loading/home" element={<HomeLoading />} />
            <Route path="/loading/genai" element={<GenAILoading />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/account" element={<ManageAccount />} />
            <Route path="/smart-reminders" element={<SmartReminders />} />
            <Route path="/genai" element={<GenAI />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
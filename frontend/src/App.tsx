import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import About from './about/About';
import Contact from './contact/Contact';
import ThankYou from './contact/ThankYou';
import { Login, Signup } from './Login-Signup';
import GoogleCallback from './Login-Signup/GoogleCallback';
import LoadingScreen from './Loading/LoadingScreen';
import NeuralRemindersLoading from './Loading/NeuralRemindersLoading';
import HomeLoading from './Loading/HomeLoading';
import GenAILoading from './Loading/GenAILoading';
import NeuralHealthLoading from './Loading/NeuralHealthLoading';
import ManageAccount from './manage account/ManageAccount';
import SmartReminders from './Reminders/SmartReminders';
import GenAI from './Guardian/GenAI';
import HealthDashboard from './health-dashboard/HealthDashboard';
import HealthDataUpload from './health-dashboard/HealthDataUpload';
import NeuralHealth from './NeuralHealth/NeuralHealth';
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
            <Route path="/loading/account" element={<LoadingScreen destination="/account" loadingText="LOADING ACCOUNT SETTINGS" />} />
            <Route path="/loading/neural-health" element={<NeuralHealthLoading />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/account" element={<ManageAccount />} />
            <Route path="/smart-reminders" element={<SmartReminders />} />
            <Route path="/genai" element={<GenAI />} />
            <Route path="/health/dashboard" element={<HealthDashboard />} />
            <Route path="/health/upload" element={<HealthDataUpload />} />
            <Route path="/neural-health" element={<NeuralHealth />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
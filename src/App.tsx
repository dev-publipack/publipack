import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { clarity } from 'react-microsoft-clarity';
import { initializeUtmTracking } from './shared/lib/analytics';

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(import.meta.env.VITE_TRACKING_ID || 'G-HN81Z9WNL3');
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    
    // Initialize Microsoft Clarity
    const clarityId = import.meta.env.VITE_CLARITY_ID || 'uiyrsokzzw';
    clarity.init(clarityId);
    
    // Initialize UTM tracking for both GA4 and Clarity
    // Delay to ensure Clarity is fully initialized
    setTimeout(() => {
      initializeUtmTracking();
    }, 300);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { clarity } from 'react-microsoft-clarity';
import HomePage from './pages/home-page';
import LegacyHomePage from './pages/legacy/legacy-home-page';
import { initializeUtmTracking } from './shared/lib/analytics';

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(import.meta.env.VITE_TRACKING_ID || 'G-HN81Z9WNL3');

    // Set campaign from UTM before first pageview so GA4 attributes the session
    initializeUtmTracking();
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });

    // Initialize Microsoft Clarity (UTM already set in initializeUtmTracking)
    const clarityId = import.meta.env.VITE_CLARITY_ID || 'uiyrsokzzw';
    clarity.init(clarityId);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/legacy" element={<LegacyHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
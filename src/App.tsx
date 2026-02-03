import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { clarity } from 'react-microsoft-clarity';

function App() {
  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_TRACKING_ID || 'G-HN81Z9WNL3');
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, [])

  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_ID || 'uiyrsokzzw';
    clarity.init(clarityId);
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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { Version1Page } from './pages/version1-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/version1" element={<Version1Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
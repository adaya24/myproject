// src/App.tsx
// src/App.tsx - FIXED
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InputPage from './pages/InputPage';
import Recovery from './pages/Recovery';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/recovery" element={<Recovery />} />
    </Routes>
  );
}

export default App;
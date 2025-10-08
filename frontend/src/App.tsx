// Define the expected structure of the API response

import { Routes, Route } from 'react-router-dom';
import Recovery from './pages/Recovery'; // <--- This line imports the Recovery component

function App() {
  return (
    // ...
    <Routes>
      {/* This line uses the imported Recovery component as the element for the homepage */}
      <Route path="/" element={<Recovery />} /> 
      {/* ... */}
    </Routes>
  );
}

export default App;

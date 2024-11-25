import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Mastermind from './Mastermind'; // Assuming your Mastermind component is in Mastermind.js
import SuikaGame from './SuikaGame'; // Import the SuikaGame component
import CrossMath from './CrossMath'; // Import the CrossMath component
import ZenWord from './ZenWord'; // Import the ZenWord component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mastermind" element={<Mastermind />} />
        <Route path="/suika" element={<SuikaGame />} />
        <Route path="/crossmath" element={<CrossMath />} />
        <Route path="/zenword" element={<ZenWord />} />
      </Routes>
    </Router>
  );
}

export default App;

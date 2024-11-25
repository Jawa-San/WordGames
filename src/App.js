import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Mastermind from './Mastermind';
import SuikaGame from './SuikaGame';
import CrossMath from './CrossMath';
import ZenWord from './ZenWord';

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

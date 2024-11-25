import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function SuikaGame() {
  useEffect(() => {
    document.title = "Suika Game"; // Set the title for the Suika Game page
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 via-yellow-200 to-red-300 flex flex-col items-center justify-center">
      <Link to="/" className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded">
        Go Back to Homepage
      </Link>
      <h1 className="text-4xl font-bold text-black mb-4">Suika Game</h1>
      <p className="text-lg text-black mb-8">This is where the Suika Game will be implemented.</p>
    </div>
  );
}

export default SuikaGame;
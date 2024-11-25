import React from 'react';
import { Link } from 'react-router-dom';

function ZenWord() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-300 flex flex-col items-center justify-center">
      <Link to="/" className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded">
        Go Back to Homepage
      </Link>
      <h1 className="text-3xl font-bold text-black mb-4">ZenWord</h1>
      <p className="text-lg text-black mb-8">Welcome to ZenWord! Start your word journey here.</p>
      
      {/* Game content goes here */}
      <div className="w-full max-w-md bg-white p-4 rounded shadow-md">
        <p className="text-center text-gray-700">Game content will be implemented here.</p>
      </div>
    </div>
  );
}

export default ZenWord;
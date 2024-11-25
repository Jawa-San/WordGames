import React, { useState } from 'react';
import './App.css'; // Import the custom CSS file
import { Link } from 'react-router-dom';

function CrossMath() {
  // Initial grid setup with some pre-filled cells and blanks
  const initialGrid = [
    ['6', '+', '', '=', '10'],
    ['+', '\\', '+', '\\', '-'],
    ['', '+', '2', '=', '6'],
    ['=', '\\', '=', '\\', '='],
    ['10', '-', '6', '=', ''],
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [message, setMessage] = useState('');
  const [numberBank, setNumberBank] = useState(['4', '4', '4']); // Updated number bank to include an extra '4'

  const handleChange = (row, col, value) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
    );
    setGrid(newGrid);
  };

  const checkSolution = () => {
    // Updated validation logic to include grid[2][0]
    const isValid = grid[0][2] === '4' && grid[4][4] === '4' && grid[2][0] === '4';
    setMessage(isValid ? 'Congratulations! You solved it!' : 'Try again!');
  };

  const handleDragStart = (event, number) => {
    event.dataTransfer.setData('text/plain', number);
  };

  const handleDrop = (event, row, col) => {
    event.preventDefault();
    const number = event.dataTransfer.getData('text/plain');
    handleChange(row, col, number);

    // Remove the number from the number bank
    setNumberBank((prevBank) => {
      const index = prevBank.indexOf(number);
      if (index > -1) {
        const newBank = [...prevBank];
        newBank.splice(index, 1);
        return newBank;
      }
      return prevBank;
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 flex flex-col items-center justify-center">
      <Link to="/" className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded">
        Go Back to Homepage
      </Link>
      <h1 className="text-3xl font-bold text-black mb-4">CrossMath</h1>
      
      {/* Number Bank Section */}
      <div className="flex space-x-2 mb-4">
        {numberBank.map((number, index) => (
          <div
            key={index}
            className="w-16 h-16 flex items-center justify-center bg-white border-2 border-black rounded text-2xl font-bold"
            draggable
            onDragStart={(e) => handleDragStart(e, number)}
          >
            {number}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onDragOver={handleDragOver}
              className={`w-16 h-16 text-center border-2 border-black rounded text-2xl font-bold ${
                cell === '\\' ? 'invisible' : ''
              } ${['6', '+', '=', '10', '-', '2'].includes(cell) ? 'bg-gray-200' : ''}`}
              disabled={['6', '+', '=', '10', '-', '2'].includes(cell)}
            />
          ))
        )}
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        onClick={checkSolution}
      >
        Check Solution
      </button>
      {message && <p className="text-lg text-black">{message}</p>}
    </div>
  );
}

export default CrossMath;
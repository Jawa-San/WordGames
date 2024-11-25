// src/Mastermind.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Import the custom CSS file
import { Link } from 'react-router-dom';

const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

function Mastermind() {
  const [code, setCode] = useState(generateCode());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([null, null, null, null]);
  const [feedback, setFeedback] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draggingColor, setDraggingColor] = useState(null);

  useEffect(() => {
    console.log('Secret Code:', code);
    document.title = "Mastermind Game"; // Set the title for the Mastermind page
  }, [code]);

  function generateCode() {
    const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
    return shuffledColors.slice(0, 4);
  }

  function handleColorClick(color) {
    if (selectedSlot !== null) {
      const newGuess = [...currentGuess];
      newGuess[selectedSlot] = color;
      setCurrentGuess(newGuess);
      setSelectedSlot(null);
    } else {
      const index = currentGuess.findIndex(slot => slot === null);
      if (index !== -1) {
        const newGuess = [...currentGuess];
        newGuess[index] = color;
        setCurrentGuess(newGuess);
      }
    }
  }

  function handleGuessSlotClick(index) {
    if (currentGuess[index] !== null) {
      const newGuess = [...currentGuess];
      newGuess[index] = null;
      setCurrentGuess(newGuess);
    } else {
      setSelectedSlot(index);
    }
  }

  function handleDragStart(e, color) {
    e.dataTransfer.setData('color', color);
    setDraggingColor(color);

    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.style.width = '40px';
    dragImage.style.height = '40px';
    dragImage.style.backgroundColor = color;
    dragImage.style.borderRadius = '50%';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px'; // Move it off-screen
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
  }

  function handleDrop(e, index) {
    const color = e.dataTransfer.getData('color');
    const newGuess = [...currentGuess];
    newGuess[index] = color;
    setCurrentGuess(newGuess);
    setDraggingColor(null);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragEnd() {
    setDraggingColor(null);
  }

  function handleSubmitGuess() {
    if (currentGuess.every(color => color !== null)) {
      const newFeedback = getFeedback(currentGuess, code);
      setGuesses([...guesses, currentGuess]);
      setFeedback([...feedback, newFeedback]);
      setCurrentGuess([null, null, null, null]);
      if (newFeedback.correctColorAndPosition === 4) {
        setGameWon(true);
      }
    }
  }

  function getFeedback(guess, code) {
    let correctColorAndPosition = 0;
    let correctColorWrongPosition = 0;
    const codeCopy = [...code];
    const guessCopy = [...guess];

    // Check for correct color and position
    guessCopy.forEach((color, index) => {
      if (color === codeCopy[index]) {
        correctColorAndPosition++;
        codeCopy[index] = null;
        guessCopy[index] = null;
      }
    });

    // Check for correct color but wrong position
    guessCopy.forEach((color, index) => {
      if (color && codeCopy.includes(color)) {
        correctColorWrongPosition++;
        codeCopy[codeCopy.indexOf(color)] = null;
      }
    });

    return { correctColorAndPosition, correctColorWrongPosition };
  }

  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 flex flex-col items-center justify-center relative">
      <Link to="/" className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded">
        Go Back to Homepage
      </Link>
      {gameWon ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Congratulations!</h1>
          <p className="text-lg text-black">You've cracked the code!</p>
          <p className="text-lg text-black">It took you {guesses.length} guesses.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              setCode(generateCode());
              setGuesses([]);
              setFeedback([]);
              setGameWon(false);
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-black mb-4">Mastermind</h1>
          <div className="flex space-x-2 mb-4">
            {colors.map(color => (
              <div
                key={color}
                className={`w-10 h-10 rounded-full ${colorClasses[color]} cursor-pointer ${draggingColor === color ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, color)}
                onDragEnd={handleDragEnd}
                onClick={() => handleColorClick(color)}
              />
            ))}
          </div>
          <div className="flex space-x-2 mb-4">
            {currentGuess.map((color, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full ${color ? colorClasses[color] : 'border-2 border-black'} cursor-pointer ${selectedSlot === index ? 'ring-2 ring-black' : ''} ${draggingColor && !color ? 'bg-gray-300' : ''}`}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                onClick={() => handleGuessSlotClick(index)}
              />
            ))}
          </div>
          <div className="mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSubmitGuess}
              disabled={currentGuess.some(color => color === null)}
            >
              Submit Guess
            </button>
          </div>
          <div className="space-y-2">
            {guesses.map((guess, index) => (
              <div key={index} className="flex space-x-2 items-center">
                {guess.map((color, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full ${colorClasses[color]}`} />
                ))}
                <div className="ml-4 text-black">
                  <span className="text-green-700">{feedback[index].correctColorAndPosition} correct position</span>, 
                  <span className="text-yellow-700"> {feedback[index].correctColorWrongPosition} correct color</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Mastermind;

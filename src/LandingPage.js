// src/LandingPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './LandingPage.css'; // Import custom styles

function LandingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gameCompletion, setGameCompletion] = useState({});

  useEffect(() => {
    document.title = "word games :}";
  }, []);

  useEffect(() => {
    // Fetch the initial state from the backend
    fetch('https://mastermindserver.onrender.com/calendarState')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setGameCompletion(data)
      })
      .catch(error => console.error('Error fetching calendar state:', error));
  }, []);

  const games = [
    'NYT Word Games',
    'Chess Puzzle',
    'Cross Math',
    'ZenWord',
    'Mastermind'
  ];

  const handleCheckboxChange = (date, game) => {
    const dateKey = date.toDateString();
    const updatedState = {
      ...gameCompletion,
      [dateKey]: {
        ...gameCompletion[dateKey],
        [game]: !gameCompletion[dateKey]?.[game]
      }
    };
    setGameCompletion(updatedState);
    console.log('Updated state:', updatedState);

    // Send the updated state to the backend
    fetch('https://mastermindserver.onrender.com/updateCalendarState', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedState)
    })
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.error('Error updating calendar state:', error));
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toDateString();
      const completedGames = games.filter(game => gameCompletion[dateKey]?.[game]);
      const allCompleted = completedGames.length === games.length;

      return (
        <div
          className="checkbox-list"
          style={{
            backgroundColor: allCompleted ? 'lightgreen' : 'transparent',
            padding: '5px',
            borderRadius: '5px'
          }}
        >
          {games.map(game => (
            <div key={game} className="game-checkbox">
              <input
                type="checkbox"
                id={`${dateKey}-${game}`}
                checked={gameCompletion[dateKey]?.[game] || false}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(date, game);
                }}
              />
              <label htmlFor={`${dateKey}-${game}`}>{game}</label>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-black mb-4">Let's play some word games ^_^</h1>
      <p className="text-lg text-black mb-8">Click below to start playing!~~</p>
      <Link to="https://www.nytimes.com/games/wordle/index.html" className="px-4 py-2 bg-purple-600 text-white rounded mb-4">
        Play Wordle
      </Link>
      <Link to="https://www.chess.com/daily-chess-puzzle" className="px-4 py-2 bg-blue-600 text-white rounded mb-4">
        Play Chess Puzzle
      </Link>
      <Link to="/mastermind" className="px-4 py-2 bg-green-600 text-white rounded mb-4">
        Play Mastermind
      </Link>
      <Link to="/crossmath" className="px-4 py-2 bg-yellow-600 text-white rounded mb-4">
        Play CrossMath
      </Link>
      <Link to="/zenword" className="px-4 py-2 bg-orange-600 text-white rounded mb-4">
        Play ZenWord
      </Link>
      <Link to="/suika" className="px-4 py-2 bg-red-600 text-white rounded">
        Play Suika Game
      </Link>
      <div className="mt-8">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={renderTileContent}
        />
      </div>
    </div>
  );
}

export default LandingPage;
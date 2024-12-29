// src/LandingPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './LandingPage.css'; // Import custom styles
import Checkbox from './Checkbox'; // Adjust the path as necessary

function LandingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gameCompletion, setGameCompletion] = useState({});
  const [todayGameCompletion, setTodayGameCompletion] = useState({});

  useEffect(() => {
    document.title = "word games :}";
  }, []);

  useEffect(() => {
    // Fetch the initial state from the backend
    fetch('https://mastermindserver.onrender.com/calendarState')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched calendar state:', data);
        setGameCompletion(data);
      })
      .catch(error => console.error('Error fetching calendar state:', error));
  }, []);

  useEffect(() => {
    // Fetch today's game completion state when the component mounts
    const dateKey = new Date().toDateString(); // Get today's date as a string
    fetch(`https://mastermindserver.onrender.com/todayGameCompletion?date=${dateKey}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched today\'s game completion:', data);
        // Ensure the data is in the correct format
        if (data) {
          setTodayGameCompletion(data); // Set the state with today's game completion data
        } else {
          console.error('No data returned for today\'s game completion');
        }
      })
      .catch(error => console.error('Error fetching today\'s game completion:', error));
  }, []);

  const games = [
    'NYT Word Games',
    'Chess Puzzle',
    'Mastermind',
    'Duolingo',
    'Cross Math',
    'ZenWord',
    'Nonogram.com'
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

  const handleTodayCheckboxChange = (game) => {
    const updatedTodayState = {
      ...todayGameCompletion,
      [game]: !todayGameCompletion[game]
    };
    setTodayGameCompletion(updatedTodayState);
    console.log('Updated today\'s state:', updatedTodayState);

    // Update the overall gameCompletion state
    const dateKey = selectedDate.toDateString();
    const updatedGameCompletion = {
      ...gameCompletion,
      [dateKey]: {
        ...gameCompletion[dateKey],
        [game]: updatedTodayState[game]
      }
    };
    setGameCompletion(updatedGameCompletion);
    console.log('Updated overall game completion state:', updatedGameCompletion);

    // Send the updated state to the backend
    fetch('https://mastermindserver.onrender.com/updateCalendarState', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedGameCompletion) // Send the updated game completion state
    })
    .then(response => response.json())
    .then(data => {
      console.log('Database updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating database:', error);
    });
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

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-black mb-4 mt-8">Let's play some word games ^_^</h1>
      <p className="text-lg text-black mb-8">Click below to start playing!~~</p>

      <div className="today-section mb-8" style={{ marginBottom: '20px' }}>
        {isToday(selectedDate) && (
          <>
            <h2 className="text-2xl font-semibold text-black">Today's Games</h2>
            <div className="checkbox-list" style={{ marginTop: '15px' }}>
              {games.map(game => (
                <div key={game} className="game-checkbox" style={{ marginBottom: '10px' }}>
                  <Checkbox
                    checked={todayGameCompletion[game] || false}
                    onChange={() => handleTodayCheckboxChange(game)}
                  />
                  <label 
                    htmlFor={`today-${game}`} 
                    style={{ marginLeft: '15px', fontWeight: 'bold' }}
                  >
                    {game}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Link to="https://www.nytimes.com/games/wordle/index.html" className="px-4 py-2 bg-purple-600 text-white rounded mb-4">
        Play Wordle
      </Link>
      <Link to="https://www.chess.com/daily-chess-puzzle" className="px-4 py-2 bg-blue-600 text-white rounded mb-4">
        Play Chess Puzzle
      </Link>
      <Link to="/mastermind" className="px-4 py-2 bg-blue-400 text-white rounded mb-4">
        Play Mastermind
      </Link>
      <Link to="https://www.duolingo.com/" className="px-4 py-2 bg-green-600 text-white rounded mb-4">
        Play Duolingo
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
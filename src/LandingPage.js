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
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    document.title = "word games :}";
  }, []);

  // Load from localStorage first, then try to sync with server
  useEffect(() => {
    // Load from localStorage immediately
    const savedData = localStorage.getItem('gameCompletion');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setGameCompletion(parsedData);
        console.log('Loaded from localStorage:', parsedData);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }

    // Then try to fetch from server and merge
    fetch('https://mastermindserver.onrender.com/calendarState')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
             .then(serverData => {
         console.log('Fetched calendar state from server:', serverData);
         setIsOnline(true);
         
         // Merge server data with local data (server takes precedence for conflicts)
         setGameCompletion(prevLocal => {
           const mergedData = { ...prevLocal, ...serverData };
           
           // If local data has changes not on server, upload them
           const hasLocalChanges = JSON.stringify(prevLocal) !== JSON.stringify(serverData);
           if (hasLocalChanges && Object.keys(prevLocal).length > 0) {
             console.log('Uploading local changes to server...');
             fetch('https://mastermindserver.onrender.com/updateCalendarState', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify(mergedData)
             })
             .then(response => {
               if (response.ok) {
                 console.log('Local changes uploaded successfully');
               } else {
                 console.error('Failed to upload local changes');
               }
             })
             .catch(error => console.error('Error uploading local changes:', error));
           }
           
           // Save the merged data to localStorage
           localStorage.setItem('gameCompletion', JSON.stringify(mergedData));
           return mergedData;
         });
       })
      .catch(error => {
        console.error('Error fetching calendar state from server:', error);
        setIsOnline(false);
        // If server fails, we'll continue with localStorage data
      });
  }, []);



  const games = [
    'NYT Word Games',
    'Chess Puzzle',
    'Mastermind',
    'Duolingo',
    'Solitaire',
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
    
    // Always save to localStorage first (immediate backup)
    localStorage.setItem('gameCompletion', JSON.stringify(updatedState));
    setGameCompletion(updatedState);
    console.log('Updated state:', updatedState);

    // Try to send to server with retry logic
    const updateServer = async (retryCount = 0) => {
      try {
        const response = await fetch('https://mastermindserver.onrender.com/updateCalendarState', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedState)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const message = await response.text();
        console.log('Server updated successfully:', message);
        setIsOnline(true);
      } catch (error) {
        console.error('Error updating server:', error);
        setIsOnline(false);
        
        // Retry up to 2 times with exponential backoff
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Retrying server update in ${delay}ms...`);
          setTimeout(() => updateServer(retryCount + 1), delay);
        } else {
          console.log('Server update failed, but data is saved locally');
        }
      }
    };
    
    updateServer();
  };

  const handleTodayCheckboxChange = (game) => {
    const today = new Date();
    const dateKey = today.toDateString();
    const updatedGameCompletion = {
      ...gameCompletion,
      [dateKey]: {
        ...gameCompletion[dateKey],
        [game]: !gameCompletion[dateKey]?.[game]
      }
    };
    
    // Always save to localStorage first (immediate backup)
    localStorage.setItem('gameCompletion', JSON.stringify(updatedGameCompletion));
    setGameCompletion(updatedGameCompletion);
    console.log('Updated game completion state:', updatedGameCompletion);

    // Try to send to server with retry logic
    const updateServer = async (retryCount = 0) => {
      try {
        const response = await fetch('https://mastermindserver.onrender.com/updateCalendarState', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedGameCompletion)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Database updated successfully:', data);
        setIsOnline(true);
      } catch (error) {
        console.error('Error updating database:', error);
        setIsOnline(false);
        
        // Retry up to 2 times with exponential backoff
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Retrying database update in ${delay}ms...`);
          setTimeout(() => updateServer(retryCount + 1), delay);
        } else {
          console.log('Database update failed, but data is saved locally');
        }
      }
    };
    
    updateServer();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Word Games :]</h1>
          <p className="text-xl text-gray-600">Let's conquer some puzzles together!</p>
          
          {/* Connection Status Indicator */}
          <div className="mt-4">
            {isOnline ? (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connected - Data synced to cloud
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Offline - Data saved locally only
              </div>
            )}
          </div>
        </div>

        {/* Top Row: Today's Games and Quick Access side by side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Games */}
          {isToday(selectedDate) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Games</h2>
              <div className="space-y-3">
                {games.map(game => {
                  const today = new Date();
                  const todayKey = today.toDateString();
                  const isCompleted = gameCompletion[todayKey]?.[game] || false;
                  return (
                    <div key={game} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        checked={isCompleted}
                        onChange={() => handleTodayCheckboxChange(game)}
                      />
                      <label 
                        className={`ml-4 text-lg cursor-pointer select-none ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}
                        onClick={() => handleTodayCheckboxChange(game)}
                      >
                        {game}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Access Games */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Let's Play!</h2>
            <div className="space-y-3">
              <Link 
                to="https://www.nytimes.com/games/wordle/index.html" 
                className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-medium transition-colors"
              >
                NYT Word Games
              </Link>
              <Link 
                to="https://www.chess.com/daily-chess-puzzle" 
                className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
              >
                Chess Puzzle
              </Link>
              <Link 
                to="/mastermind" 
                className="block w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center font-medium transition-colors"
              >
                Mastermind
              </Link>
              <Link 
                to="https://www.duolingo.com/" 
                className="block w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-center font-medium transition-colors"
              >
                Duolingo
              </Link>
              <Link 
                to="https://solitaired.com/" 
                className="block w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-center font-medium transition-colors"
              >
                Solitaire
              </Link>
            </div>
          </div>
        </div>

        {/* Full Width Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Progress Calendar</h2>
          <div className="calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={renderTileContent}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

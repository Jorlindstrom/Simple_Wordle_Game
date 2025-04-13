import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import { selectWord } from './logic/selectWord';
import { wordle } from './logic/wordle';
import './App.css';

const words = ["storm", "stark", "start", "sword", "mango", "piano", "banana", "kuslig", "tavlan"]; // Example words

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [warning, setWarning] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [showSettings, setShowSettings] = useState(true); // State to manage which page to show

  const startGame = () => {
    const result = selectWord(words, wordLength, allowDuplicates);
    if (result.error) {
      setWarning(result.error);
    } else {
      setCurrentWord(result.word);
      setGuesses([]);
      setInput("");
      setGameOver(false);
      setWon(false);
      setWarning("");
      setStartTime(Date.now());
      setShowSettings(false); // Hide settings and show game
    }
  };

  useEffect(() => {
    const result = selectWord(words, wordLength, allowDuplicates);
    if (result.error) {
      setWarning(result.error);
    } else {
      setCurrentWord(result.word);
      setWarning("");
    }
  }, [wordLength, allowDuplicates, words]);

  useEffect(() => {
    if (gameOver && startTime) {
      const endTime = Date.now();
      setTimeTaken((endTime - startTime) / 1000); // Time taken in seconds
    }
  }, [gameOver, startTime]);

  const handleGuess = () => {
    if (input.length !== wordLength || gameOver) return;
    const feedback = wordle(input, currentWord);
    setGuesses([...guesses, { guess: input, feedback }]);
    setInput("");

    if (input === currentWord) {
      setGameOver(true);
      setWon(true);
    } else if (guesses.length >= 5) {
      setGameOver(true);
      setWon(false);
    }
  };

  const handleRestart = () => {
    startGame();
  };

  // Function to format time in minutes and seconds
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes} minutes and ${seconds} seconds`;
  };

  return (
    <div className="App">
      {showSettings ? (
        <Settings
          wordLength={wordLength}
          setWordLength={setWordLength}
          allowDuplicates={allowDuplicates}
          setAllowDuplicates={setAllowDuplicates}
          startGame={startGame}
          words={words}
        />
      ) : (
        <>
          <h1>Wordle-like Game</h1>
          {warning && <div className="warning">{warning}</div>}
          <div>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGuess()} disabled={gameOver} />
            <button onClick={handleGuess} disabled={gameOver}>Guess</button>
          </div>
          <div>
            {guesses.map(({ guess, feedback }, index) => (
              <div key={index} className="guess">
                {guess.split('').map((letter, i) => (
                  <span key={i} className={`letter ${feedback[i]}`}>{letter}</span>
                ))}
              </div>
            ))}
          </div>
          {gameOver && (
            <div>
              {won ? (
                <div>
                  <p>Congratulations! You found the word!</p>
                  <p>Time taken: {formatTime(timeTaken)}</p>
                  <p>Guesses: {guesses.length}</p>
                  <p>Please enter your name for the highscore list:</p>
                  <input type="text" placeholder="Your Name" />
                  <button>Submit</button>
                </div>
              ) : (
                <div>
                  <p>Game Over! The correct word was {currentWord}</p>
                  <button onClick={handleRestart}>Restart</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
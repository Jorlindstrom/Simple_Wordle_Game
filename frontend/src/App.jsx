import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import { wordle } from './logic/wordle';
import { getRandomWord } from './wordService';
import './App.css';

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
  const [showSettings, setShowSettings] = useState(true);
  const [loading, setLoading] = useState(false);

  // Asynkron startGame-funktion som använder API
  const startGame = async () => {
    setLoading(true);
    setWarning("");
    
    try {
      console.log('Startar spel med inställningar:', { wordLength, allowDuplicates });
      const result = await getRandomWord(wordLength, allowDuplicates);
      
      if (result.error) {
        console.error('Fel vid start av spel:', result.error);
        setWarning(result.error);
      } else {
        console.log('Spel startat med ord:', result.word);
        setCurrentWord(result.word);
        setGuesses([]);
        setInput("");
        setGameOver(false);
        setWon(false);
        setStartTime(Date.now());
        setShowSettings(false); // Dölj inställningar och visa spelet
      }
    } catch (error) {
      console.error('Oväntat fel vid start av spel:', error);
      setWarning("Kunde inte starta spelet: " + (error.message || "Okänt fel"));
    } finally {
      setLoading(false);
    }
  };

  // Hämta ett testord när inställningarna ändras (i inställningsvyn)
  useEffect(() => {
    if (showSettings) {
      const fetchWord = async () => {
        try {
          console.log('Förhandsgranskar ord med inställningar:', { wordLength, allowDuplicates });
          const result = await getRandomWord(wordLength, allowDuplicates);
          
          if (result.error) {
            console.warn('Kunde inte förhandsgranska ord:', result.error);
            setWarning(result.error);
          } else {
            console.log('Förhandsgranskade ordet:', result.word);
            setCurrentWord(result.word);
            setWarning("");
          }
        } catch (error) {
          console.error('Fel vid förhandsgranskning av ord:', error);
          setWarning("Fel vid hämtning av ord: " + (error.message || "Okänt fel"));
        }
      };
      
      fetchWord();
    }
  }, [wordLength, allowDuplicates, showSettings]);

  // Beräkna tid när spelet är över
  useEffect(() => {
    if (gameOver && startTime) {
      const endTime = Date.now();
      setTimeTaken((endTime - startTime) / 1000);
    }
  }, [gameOver, startTime]);

  // Hantera gissning
  const handleGuess = () => {
    if (!currentWord) {
      setWarning("Inget ord har hämtats från servern.");
      return;
    }
    
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

  // Starta ett nytt spel
  const handleRestart = () => {
    startGame();
  };

  // Formatterar tid till läsbart format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes} ${minutes === 1 ? 'minut' : 'minuter'} och ${seconds} ${seconds === 1 ? 'sekund' : 'sekunder'}`;
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
          loading={loading}
          warning={warning}
        />
      ) : (
        <>
          <h1>Wordle-like Game</h1>
          {warning && <div className="warning">{warning}</div>}
          <div>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()} 
              disabled={gameOver} 
              maxLength={wordLength}
              placeholder={`Ange ett ${wordLength}-bokstavs ord`}
            />
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
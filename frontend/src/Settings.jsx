import React, { useEffect, useState } from 'react';
import { selectWord } from './logic/selectWord';

const Settings = ({ wordLength, setWordLength, allowDuplicates, setAllowDuplicates, startGame, words }) => {
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const result = selectWord(words, wordLength, allowDuplicates);
    if (result.error) {
      setWarning(result.error);
    } else {
      setWarning("");
    }
  }, [wordLength, allowDuplicates, words]); // Ensure the dependency array is constant in size and order

  return (
    <div className="settings">
      <h2>Game Settings</h2>
      <div>
        <label>
          Word Length:
          <input type="number" value={wordLength} onChange={(e) => setWordLength(Number(e.target.value))} />
        </label>
      </div>
      <div>
        <label>
          Allow Duplicates:
          <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} />
        </label>
      </div>
      {warning && <p className="warning">{warning}</p>}
      <button onClick={startGame} disabled={!!warning}>Start Game</button>
    </div>
  );
};

export default Settings;
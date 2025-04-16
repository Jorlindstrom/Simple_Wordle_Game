import React from 'react';

function Settings({ 
  wordLength, 
  setWordLength, 
  allowDuplicates, 
  setAllowDuplicates, 
  startGame, 
  loading,
  warning 
}) {
  return (
    <div className="settings">
      <h1>Wordle-like Game Settings</h1>
      {warning && <div className="warning">{warning}</div>}
      <div>
        <label>
          Word Length:
          <input
            type="number"
            min="3"
            max="10"
            value={wordLength}
            onChange={(e) => setWordLength(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
          />
          Allow Duplicate Letters
        </label>
      </div>
      <button onClick={startGame} disabled={loading}>
        {loading ? 'Loading...' : 'Start Game'}
      </button>
    </div>
  );
}

export default Settings;
import express from "express";
import fs from "fs/promises";
import { selectWord } from './logic/selectWord.js';

const app = express();
const PORT = 5080;


async function getWordsFromFile() {
  try {
    const wordsData = await fs.readFile('./words.json', 'utf8');
    const parsedData = JSON.parse(wordsData);
    const words = parsedData.words || [];

    //res.status(200).json({ words });
    console.log('Extraherad words-array:', words);
    return words;

  } catch (error) {
    console.error('Fel vid läsning av words.json:', error);
    return [];
  }
}

// API-endpoint med asynkron hantering
app.get('/api/random-word', async (req, res) => {
  try {
    console.log('Mottog förfrågan med parametrar:', req.query);
    
    const length = parseInt(req.query.length) || 5;
    const allowDuplicates = req.query.allowDuplicates === 'true';
    
    console.log('Hämtar ord från fil...');
    const words = await getWordsFromFile();
    
    console.log(`Hittade ${words.length} ord totalt`);
    
    if (!words || words.length === 0) {
      console.log('Inga ord hittades i filen');
      return res.status(404).json({ error: 'Inga ord hittades i databasen' });
    }
    
    console.log('Använder selectWord med parametrar:', { length, allowDuplicates });
    const result = selectWord(words, length, allowDuplicates);
    
    if (result.error) {
      console.log('selectWord returnerade ett fel:', result.error);
      return res.status(404).json({ error: result.error });
    }
    
    console.log('Valt ord:', result.word);
    res.json({ data: result.word });
  } catch (error) {
    console.error('Fel vid hantering av förfrågan:', error);
    res.status(500).json({ error: 'Något gick fel på servern' });
  }
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// API URL - anpassa till din server
const API_URL = '/api';

// Funktion för att hämta slumpmässigt ord från API
export async function getRandomWord(length = 5, allowDuplicates = false) {
  console.log('Anropar API med:', { length, allowDuplicates });
  
  try {
    const response = await fetch(
      `${API_URL}/random-word?length=${length}&allowDuplicates=${allowDuplicates}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunde inte hämta ord från servern');
    }
    
    const data = await response.json();
    console.log('API svarade med:', data);
    return { word: data.data };
  } catch (error) {
    console.error('Fel vid hämtning av ord:', error);
    return { error: error.message };
  }
}
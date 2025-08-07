// Mock API Example - This shows what your backend endpoint should return
// Endpoint: GET http://localhost:4000/api/adjectives

// Example response format:
const mockAdjectivesResponse = [
  { id: 1, text: 'Enthusiastic', question_number: 1, most_shape: 'S', least_shape: 'S' },
  { id: 2, text: 'Daring', question_number: 1, most_shape: 'Z', least_shape: 'Z' },
  { id: 3, text: 'Diplomatic', question_number: 1, most_shape: '*', least_shape: '*' },
  { id: 4, text: 'Satisfied', question_number: 1, most_shape: 'T', least_shape: 'T' },
  { id: 5, text: 'Cautious', question_number: 2, most_shape: '*', least_shape: '*' },
  { id: 6, text: 'Determined', question_number: 2, most_shape: 'Z', least_shape: 'Z' },
  { id: 7, text: 'Convincing', question_number: 2, most_shape: 'S', least_shape: 'S' },
  { id: 8, text: 'Good-natured', question_number: 2, most_shape: 'T', least_shape: 'N' },
  // ... continue for all 112 adjectives
];

// Backend endpoint example (Node.js/Express):
/*
app.get('/api/adjectives', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, text FROM adjectives ORDER BY question_number, id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching adjectives:', error);
    res.status(500).json({ error: 'Failed to fetch adjectives' });
  }
});
*/

// The frontend will receive this data and create:
// 1. adjectiveMap: Map where key = adjective text, value = adjective id
// 2. adjectiveIdMap: Map where key = adjective id, value = adjective text

// Example usage in answers object:
// Before: { most: "Enthusiastic", least: "Daring" }
// After: { most: 1, least: 2 }

console.log('Mock API response format:', mockAdjectivesResponse.slice(0, 4)); 
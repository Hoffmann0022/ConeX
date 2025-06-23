export async function loadGameData() {
  try {
    const [questionsResponse, cardsResponse] = await Promise.all([
      fetch('../data/questions.json'),
      fetch('../data/learningCards.json')
    ]);
    const questions = await questionsResponse.json();
    const cards = await cardsResponse.json();

    return {
      questions: shuffleArray(questions),
      cards: shuffleArray(cards),
    };
  } catch (error) {
    console.error('Error loading game data: ', error);
    throw new Error('Failed to load game data');
  }
}

function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

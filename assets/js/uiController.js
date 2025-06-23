import { Game } from './gameLogic.js';
import { loadGameData } from './dataLoader.js';

const playerTurnMessage = document.getElementById('playerTurnMessage');
const spinRouletteButton = document.getElementById('spinRouletteButton');
const roulettePopup = document.getElementById('roulettePopup');
const rouletteWheel = document.getElementById('rouletteWheel');
const rouletteMessage = document.getElementById('rouletteMessage');
const closeRoulettePopupButton = document.getElementById('closeRoulettePopup');
const cardPopup = document.getElementById('cardPopup');
const cardContent = document.getElementById('cardContent');
const closeCardPopupButton = document.getElementById('closeCardPopup');
const questionPopup = document.getElementById('questionPopup');
const questionText = document.getElementById('questionText');
const questionOptions = document.getElementById('questionOptions');
const closeQuestionPopupButton = document.getElementById('closeQuestionPopup');
const boardSpace = document.querySelector('.board-space');
const boardSpaceBlue = document.querySelectorAll('.blue');
const boardSpaceGreen = document.querySelectorAll('.green');
const boardSpaceOrange = document.querySelectorAll('.orange');

let lastRotation = 0;
let game;

/**
 * Inicializa o jogo após o carregamento da página.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const players = JSON.parse(localStorage.getItem('gamePlayers'));
  if (!players || players.length === 0) {
    window.location.href = '../html/lobby.html';
    return;
  }

  game = new Game(players);
  try {
    const data = await loadGameData();
    game.setGameData(data);
  } catch {
    alert('Erro ao carregar dados do jogo.');
    return;
  }

  updatePlayerTurnMessage();
  renderPlayerTokens();
});

/**
 * Atualiza a mensagem informando de quem é a vez.
 */
function updatePlayerTurnMessage() {
  const player = game.getCurrentPlayer();
  playerTurnMessage.textContent = `${player.name}'s turn`;
  playerTurnMessage.style.color = player.color;
}

/**
 * Renderiza os tokens dos jogadores nas posições correspondentes.
 */
function renderPlayerTokens() {
  document.querySelectorAll('.player-token').forEach(token => token.remove());

  game.players.forEach(player => {
    const token = document.createElement('div');
    token.classList.add('player-token');
    token.style.backgroundColor = player.color;
    token.dataset.playerId = player.id;
    Object.assign(token.style, {
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      margin: '10px',
      opacity: '0.9',
    });

    let targetSpace = player.position === 0
      ? document.querySelector('.start')
      : document.getElementById(`space-${player.position}`);

    if (player.position !== 0) {
      token.style.position = 'absolute';
    }

    if (targetSpace) {
      targetSpace.appendChild(token);
    }
  });
}

/**
 * Realiza o giro da roleta, animando e calculando o resultado.
 */
function spinRoulette() {
  spinRouletteButton.disabled = true;
  roulettePopup.classList.remove('hidden');
  rouletteMessage.textContent = 'Spinning...';
  closeRoulettePopupButton.classList.add('hidden');

  const roll = Math.floor(Math.random() * 6) + 1;
  const baseAngleMap = { 1: 60, 2: 120, 3: 180, 4: 240, 5: 300, 6: 0 };
  const POINTER_ALIGNMENT_OFFSET = 215;
  const targetAngle = (baseAngleMap[roll] + POINTER_ALIGNMENT_OFFSET) % 360;
  const fullRotations = 6;
  const newRotation = lastRotation + (fullRotations * 360) + (360 - targetAngle);

  rouletteWheel.style.transition = 'transform 4s cubic-bezier(0.2,0.9,0.3,1)';
  rouletteWheel.style.transform = `rotate(${newRotation}deg)`;

  setTimeout(() => {
    rouletteMessage.textContent = `You took ${roll}!`;
    rouletteWheel.style.transition = 'none';
    lastRotation = (360 - targetAngle) % 360;
    rouletteWheel.style.transform = `rotate(${lastRotation}deg)`;

    setTimeout(() => {
      rouletteWheel.style.transition = 'transform 4s cubic-bezier(0.2,0.9,0.3,1)';
    }, 50);

    closeRoulettePopupButton.classList.remove('hidden');
    roulettePopup.dataset.currentRoll = roll;
  }, 4500);
}

/**
 * Esconde o popup da roleta.
 */
function hideRoulettePopup() {
  roulettePopup.classList.add('hidden');
  rouletteMessage.textContent = 'Click on the roulette wheel to spin!!';
}

/**
 * Move o jogador pelo tabuleiro.
 * @param {number} spaces Número de casas para avançar.
 */
function movePlayer(spaces) {
  game.movePlayer(spaces);
  renderPlayerTokens();

  setTimeout(checkSpecialSpace, 500);
}

/**
 * Verifica se o jogador caiu em espaço especial e executa ação correspondente.
 */
function checkSpecialSpace() {
  const action = game.checkSpecialSpace(game.getCurrentPlayer().position);

  switch (action) {
    case 'card':
      showCard();
      break;
    case 'question':
      showQuestion();
      break;
    default:
      endTurn();
  }
}

/**
 * Exibe o popup de carta de aprendizagem.
 */
function showCard() {
  const card = game.drawCard();
  if (!card) {
    alert('No cards left.');
    endTurn();
    return;
  }
  cardContent.innerHTML = `<h3>${card.title}</h3><p>${card.description}</p>`;
  cardPopup.classList.remove('hidden');
}

/**
 * Exibe o popup de pergunta.
 */
function showQuestion() {
  const question = game.drawQuestion();
  if (!question) {
    alert('No questions left.');
    endTurn();
    return;
  }

  questionText.textContent = question.question;
  questionOptions.innerHTML = '';

  question.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.classList.add('question-option-button');
    btn.addEventListener('click', () => {
      const correct = game.answerQuestion(option, question.correctAnswer);
      alert(correct ? 'Correct! Move 2 spaces forward.' : 'Incorrect! Move 2 spaces backward.');
      renderPlayerTokens();
      setTimeout(hideQuestionPopup, 1500);
    });
    questionOptions.appendChild(btn);
  });

  questionPopup.classList.remove('hidden');
}

/**
 * Esconde o popup de pergunta e verifica se o jogador venceu.
 */
function hideQuestionPopup() {
  questionPopup.classList.add('hidden');

  if (game.hasWon()) {
    const podium = game.players
      .sort((a, b) => b.position - a.position)
      .slice(0, 3);

    localStorage.setItem('gamePodium', JSON.stringify(podium));
    window.location.href = '../html/champion.html'; 
    return;
  }

  endTurn();
}

/**
 * Finaliza a vez do jogador atual e passa para o próximo.
 */
function endTurn() {
  game.nextTurn();
  updatePlayerTurnMessage();
  spinRouletteButton.disabled = false;
}

// Event Listeners
spinRouletteButton.addEventListener('click', spinRoulette);

closeRoulettePopupButton.addEventListener('click', () => {
  const roll = parseInt(roulettePopup.dataset.currentRoll, 10);
  movePlayer(roll);
  hideRoulettePopup();
});

closeCardPopupButton.addEventListener('click', () => {
  cardPopup.classList.add('hidden');
  endTurn();
});

closeQuestionPopupButton.addEventListener('click', () => {
  hideQuestionPopup();
});

rouletteWheel.addEventListener('click', () => {
  if (!spinRouletteButton.disabled) spinRoulette();
});

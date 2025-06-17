const BOARD_SIZE = 96;
const DEFAULT_PLAYER_COLORS = ['#FF6347', '#6A5ACD', '#3CB371', '#FFD700', '#1E90FF'];

let gamePlayers = [];
let currentPlayerIndex = 0;
let questionsData = [];
let learningCardsData = [];
let currentQuestion = null;

// DOM Elements
const playerTurnMessage = document.getElementById('playerTurnMessage');
const spinRouletteButton = document.getElementById('spinRouletteButton');
const gameBoardContainer = document.getElementById('gameBoard');
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

let lastRotation = 0;

document.addEventListener('DOMContentLoaded', async () => {
    await loadGameData();
    initializeGame();
});

async function loadGameData() {
    try {
        const [questionsResponse, cardsResponse] = await Promise.all([
            fetch('../data/questions.json'),
            fetch('../data/learningCards.json')
        ]);

        questionsData = await questionsResponse.json();
        learningCardsData = await cardsResponse.json();

        shuffleArray(questionsData);
        shuffleArray(learningCardsData);

    } catch (error) {
        console.error('Error loading game data: ', error);
        alert('Error loading game data. Please try again.');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeGame() {
    const storedPlayers = localStorage.getItem('gamePlayers');
    if (storedPlayers) {
        gamePlayers = JSON.parse(storedPlayers);
        gamePlayers.forEach(player => player.position = 0);
    } else {
        window.location.href = '../html/lobby.html';
        return;
    }

    currentPlayerIndex = 0;
    updatePlayerTurnMessage();
    renderPlayerTokens();
}

function updatePlayerTurnMessage() {
    if (gamePlayers.length > 0) {
        playerTurnMessage.textContent = `${gamePlayers[currentPlayerIndex].name}'s turn`;
        playerTurnMessage.style.color = gamePlayers[currentPlayerIndex].color;
    } else {
        playerTurnMessage.textContent = "No players loaded.";
    }
}


function renderPlayerTokens() {
    document.querySelectorAll('.player-token').forEach(token => token.remove());

    gamePlayers.forEach(player => {
        const token = document.createElement('div');
        token.classList.add('player-token');
        token.style.backgroundColor = player.color; 
        token.dataset.playerId = player.id;
        token.style.opacity = "0.9"
        token.style.borderRadius = "50%";
        token.style.width = "40px";
        token.style.height = "40px";
        token.style.margin = "10px";
        

        let targetSpace;

        // Se estiver na posição 0, coloca na .start (fora da grid)
        if (player.position === 0) {
            targetSpace = document.querySelector('.start');
        } else {
            targetSpace = document.getElementById(`space-${player.position}`);
            token.style.position = "absolute";
        }

        if (targetSpace) {
            targetSpace.appendChild(token);
        } else {
            console.warn(`Space ${player.position} not found for player ${player.name}`);
        }
    });
}

function spinRoulette() {
    spinRouletteButton.disabled = true;
    roulettePopup.classList.remove('hidden');
    rouletteMessage.textContent = 'Spinning...';
    closeRoulettePopupButton.classList.add('hidden');

    const roll = Math.floor(Math.random() * 6) + 1;

    const baseAngleMap = {
        1: 60,
        2: 120,
        3: 180,
        4: 240,
        5: 300,
        6: 0
    };

    const POINTER_ALIGNMENT_OFFSET = 215;

    const targetAngle = (baseAngleMap[roll] + POINTER_ALIGNMENT_OFFSET) % 360;

    if (targetAngle === undefined || isNaN(targetAngle)) {
        console.error('Error: Target angle not defined or invalid for roll:', roll);
        alert('Error spinning roulette. Please try again.');
        spinRouletteButton.disabled = false;
        return;
    }

    const fullRotations = 6;
    const newRotation = lastRotation + (fullRotations * 360) + (360 - targetAngle);

    rouletteWheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.9, 0.3, 1)';
    rouletteWheel.style.transform = `rotate(${newRotation}deg)`;

    setTimeout(() => {
        rouletteMessage.textContent = `You took ${roll}!`;

        rouletteWheel.style.transition = 'none';
        lastRotation = (360 - targetAngle) % 360;
        rouletteWheel.style.transform = `rotate(${lastRotation}deg)`;

        setTimeout(() => {
            rouletteWheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.9, 0.3, 1)';
        }, 50);

        closeRoulettePopupButton.classList.remove('hidden');
        roulettePopup.dataset.currentRoll = roll;
        spinRouletteButton.disabled = false;
    }, 4500);
}
function hideRoulettePopup() {
    roulettePopup.classList.add('hidden');
    rouletteMessage.textContent = 'Click on the roulette wheel to spin!!';
}

function movePlayer(spacesToMove) {
    let currentPlayer = gamePlayers[currentPlayerIndex];
    let newPosition = currentPlayer.position + spacesToMove;

    if (newPosition >= BOARD_SIZE) {
        currentPlayer.position = BOARD_SIZE;
        renderPlayerTokens();
        checkWinCondition();
        return;
    }

    currentPlayer.position = newPosition;
    renderPlayerTokens();

    setTimeout(() => {
        checkSpecialSpace(currentPlayer.position);
    }, 500);
}

function checkSpecialSpace(position) {
    if (position % 7 === 0 && position !== 0) {
        showCard();
    } else if (position % 11 === 0 && position !== 0) {
        showQuestion();
    } else {
        endTurn();
    }
}

function showCard() {
    if (learningCardsData.length > 0) {
        if (learningCardsData.length === 0) {
            loadGameData();
        }
        const randomIndex = Math.floor(Math.random() * learningCardsData.length);
        const card = learningCardsData.splice(randomIndex, 1)[0];

        cardContent.innerHTML = `<h3>${card.title}</h3><p>${card.description}</p>`;
        cardPopup.classList.remove('hidden');
    } else {
        console.warn('No learning cards available.');
        alert('Oops! No more learning cards. Reloading...');
        loadGameData();
        endTurn();
    }
}

function hideCardPopup() {
    cardPopup.classList.add('hidden');
    endTurn();
}

function showQuestion() {
    if (questionsData.length > 0) {
        if (questionsData.length === 0) {
            loadGameData();
        }
        const randomIndex = Math.floor(Math.random() * questionsData.length);
        currentQuestion = questionsData.splice(randomIndex, 1)[0];

        questionText.textContent = currentQuestion.question;
        questionOptions.innerHTML = '';

        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('question-option-button');
            button.addEventListener('click', () => {
                checkAnswer(option, currentQuestion.correctAnswer, button);
            });
            questionOptions.appendChild(button);
        });
        questionPopup.classList.remove('hidden');
    } else {
        console.warn('No questions available.');
        alert('Oops! No more questions. Reloading...');
        loadGameData();
        endTurn();
    }
}

function checkAnswer(selectedOption, correctAnswer, clickedButton) {
    Array.from(questionOptions.children).forEach(button => button.disabled = true);

    if (selectedOption === correctAnswer) {
        clickedButton.classList.add('correct');
        alert('Correct! Move forward 2 spaces!');
        gamePlayers[currentPlayerIndex].position += 2;
    } else {
        clickedButton.classList.add('incorrect');
        Array.from(questionOptions.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            }
        });

        alert('Incorrect! Go back 2 spaces!');
        gamePlayers[currentPlayerIndex].position = Math.max(0, gamePlayers[currentPlayerIndex].position - 2 );
    }
    renderPlayerTokens();

    setTimeout(() => {
        hideQuestionPopup();
    }, 1500);
}

function hideQuestionPopup() {
    questionPopup.classList.add('hidden');
    endTurn();
}

function checkWinCondition() {
    if (gamePlayers[currentPlayerIndex].position >= BOARD_SIZE) {
        alert(`${gamePlayers[currentPlayerIndex].name} Won the game!`);

        const sortedPlayers = [...gamePlayers].sort((a, b) => b.position - a.position);
        const podium = sortedPlayers.slice(0, 3);
        console.log('Podium to save:', podium);

        localStorage.setItem('gamePodium', JSON.stringify(podium));

        window.location.href = '../html/champion.html';
        endTurn();
    }
}

function endTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % gamePlayers.length;
    updatePlayerTurnMessage();
    spinRouletteButton.disabled = false;
}

// --- LISTENERS DE EVENTOS ---
spinRouletteButton.addEventListener('click', () => {
    roulettePopup.classList.remove('hidden');
    closeRoulettePopupButton.classList.add('hidden');
    spinRoulette();
});

closeRoulettePopupButton.addEventListener('click', () => {
    const roll = parseInt(roulettePopup.dataset.currentRoll, 10);
    movePlayer(roll);
    hideRoulettePopup();
});

rouletteWheel.addEventListener('click', () => {
    if (!spinRouletteButton.disabled) {
        spinRoulette();
    }
});

closeCardPopupButton.addEventListener('click', hideCardPopup);
closeQuestionPopupButton.addEventListener('click', hideQuestionPopup);
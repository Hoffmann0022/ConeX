// assets/js/lobby.js

const MAX_PLAYERS = 5;
const PLAYER_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336']; // Suas cores disponíveis

let gamePlayers = [];
let lobbyErrorMessage = document.getElementById('lobbyErrorMessage');

const newPlayerButton = document.querySelector(".cta-button");
const overlay = document.querySelector('.overlay');
const playerPopup = document.querySelector('.player');
const savePlayerButton = document.querySelector('.player button');
const inputName = document.getElementById('playerName');
const playersListContainer = document.querySelector('.jogadores');
const buttonPlay = document.querySelector('.play');
const closeButton = document.querySelector('.bi-x-lg');
// playerColorSelect não é mais necessário para seleção do usuário, mas pode ser usado para exibir cores disponíveis se desejar.
// const playerColorSelect = document.getElementById('playerColorSelect');

document.addEventListener('DOMContentLoaded', () => {
    if (!lobbyErrorMessage) {
        lobbyErrorMessage = document.createElement('p');
        lobbyErrorMessage.id = 'lobbyErrorMessage';
        lobbyErrorMessage.style.color = 'red';
        lobbyErrorMessage.style.textAlign = 'center';
        lobbyErrorMessage.style.marginTop = '10px';
        if (buttonPlay && buttonPlay.parentNode) {
            buttonPlay.parentNode.insertBefore(lobbyErrorMessage, buttonPlay);
        } else {
            document.querySelector('main').appendChild(lobbyErrorMessage);
        }
    }
    clearLobbyError();

    loadPlayersFromLocalStorage();
    updatePlayButtonVisibility();

    playerPopup.style.display = 'none';
    closeButton.style.display = 'none';
});

newPlayerButton.addEventListener('click', (e) => {
    e.preventDefault();
    popUpNamePlayer();
});

overlay.addEventListener('click', () => {
    closePlayer();
});

closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    closePlayer();
});

savePlayerButton.addEventListener('click', () => {
    addPlayer();
});

buttonPlay.addEventListener('click', (e) => {
    startGame(e);
});

function popUpNamePlayer() {
    clearLobbyError();
    if (gamePlayers.length >= MAX_PLAYERS) {
        displayLobbyError('Maximum of ' + MAX_PLAYERS + ' players reached.');
        return;
    }
    inputName.value = '';
    // Não precisamos mais limpar playerColorSelect.value aqui, pois a cor será auto-atribuída.
    closeButton.style.display = 'block';
    overlay.style.display = 'block';
    playerPopup.style.display = 'flex';
    playerPopup.classList.add('active');
}

function closePlayer() {
    closeButton.style.display = 'none';
    overlay.style.display = 'none';
    playerPopup.style.display = 'none';
    playerPopup.classList.remove('active');
    clearLobbyError();
}

function displayLobbyError(message) {
    if (lobbyErrorMessage) {
        lobbyErrorMessage.textContent = message;
        lobbyErrorMessage.style.display = 'block';
    } else {
        alert(message);
    }
}

function clearLobbyError() {
    if (lobbyErrorMessage) {
        lobbyErrorMessage.textContent = '';
        lobbyErrorMessage.style.display = 'none';
    }
}

function addPlayer() {
    clearLobbyError();
    const name = inputName.value.trim();

    if (name === '') {
        displayLobbyError('Please, enter a name.');
        return;
    }

    if (gamePlayers.length >= MAX_PLAYERS) {
        displayLobbyError('Maximum of ' + MAX_PLAYERS + ' players reached.');
        return;
    }

    if (gamePlayers.some(player => player.name.toLowerCase() === name.toLowerCase())) {
        displayLobbyError('This player name already exists. Please choose another.');
        return;
    }

    // --- Lógica para atribuição automática da cor ---
    const usedColors = gamePlayers.map(player => player.color);
    const availableColors = PLAYER_COLORS.filter(color => !usedColors.includes(color));

    if (availableColors.length === 0) {
        displayLobbyError('No unique colors available for new players. Max players reached or colors exhausted.');
        return;
    }

    // Pega a primeira cor disponível
    const assignedColor = availableColors[0];

    const newPlayer = {
        id: gamePlayers.length + 1, // IDs podem ser ajustados se houver remoção de jogadores
        name: name,
        color: assignedColor, // Atribui a cor automaticamente
        position: 0
    };

    gamePlayers.push(newPlayer);
    updatePlayersListDisplay();
    inputName.value = '';
    closePlayer();
    updatePlayButtonVisibility();
    savePlayersToLocalStorage();
}

function updatePlayersListDisplay() {
    playersListContainer.innerHTML = '';

    if (gamePlayers.length === 0) {
        playersListContainer.innerHTML = '<p class="no-players-message">No players added yet.</p>';
        return;
    }

    gamePlayers.forEach((player) => {
        const card = document.createElement('div');
        card.classList.add('jogador-card', `jogador-${player.id}`);
        card.style.backgroundColor = player.color;
        card.dataset.jogadorId = player.id;
        card.textContent = `#${player.id} ${player.name}`;
        playersListContainer.appendChild(card);
    });
}

function updatePlayButtonVisibility() {
    if (gamePlayers.length >= 2) {
        buttonPlay.style.display = 'block';
        buttonPlay.style.pointerEvents = 'auto';
        buttonPlay.style.opacity = '1';
    } else {
        buttonPlay.style.display = 'block'; // Manter display block para manter o layout, mas desabilitar interação
        buttonPlay.style.pointerEvents = 'none';
        buttonPlay.style.opacity = '0.5';
    }
}

function savePlayersToLocalStorage() {
    localStorage.setItem('gamePlayers', JSON.stringify(gamePlayers));
}

function loadPlayersFromLocalStorage() {
    const storedPlayers = localStorage.getItem('gamePlayers');
    if (storedPlayers) {
        gamePlayers = JSON.parse(storedPlayers);
        updatePlayersListDisplay();
    }
}

function startGame(event) {
    clearLobbyError();
    if (gamePlayers.length < 2) {
        displayLobbyError('At least 2 players are required to start the game.');
        event.preventDefault(); // Impede a navegação se não houver jogadores suficientes
        return;
    }
    // Se tudo estiver OK, o fluxo normal do botão "Play" levará à próxima página (game.html)
    // Você pode adicionar window.location.href = 'game.html'; aqui se o botão não for um link direto
}

updatePlayButtonVisibility();
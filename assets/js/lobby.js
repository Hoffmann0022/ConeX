const newPlayer = document.querySelector(".cta-button");
const overlay = document.querySelector('.overlay');
const player = document.querySelector('.player');
const playButton = document.querySelector('.player button');
const inputName = document.getElementById('playerName');
const listaJogadores = document.querySelector('.jogadores');
const buttonPlay = document.querySelector('.play'); 
const closeButton = document.querySelector('.bi-x-lg');

// Cores para até 5 jogadores
const coresJogadores = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];

let jogadorAtual = 0; // Índice do jogador da vez (0 a 4)

newPlayer.addEventListener('click', () => {
    popUpNamePlayer();
});

overlay.addEventListener('click', () => {
    closePlayer();
});

closeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique no botão feche o card
    closePlayer();
})

playButton.addEventListener('click', () => {
    const nome = inputName.value.trim();

    if (nome === '') {
        alert('Por favor, insira um nome.');
        return;
    }

    const totalJogadores = listaJogadores.children.length;

    if (totalJogadores >= 5) {
        alert('Máximo de 5 jogadores atingido.');
        return;
    }

    adicionarJogador(nome, totalJogadores);
    inputName.value = '';
    closePlayer();
    atualizarVisibilidadeBotaoPlay();
});

function popUpNamePlayer() {
    closeButton.style.display = 'block';
    overlay.style.display = 'block';
    player.style.display = 'flex';
    player.classList.add('active');
}

function closePlayer() {
    closeButton.style.display = 'none';
    overlay.style.display = 'none';
    player.style.display = 'none';
    player.classList.remove('active');
}

function adicionarJogador(nome, indice) {
    const numeroJogador = indice + 1;

    const card = document.createElement('div');
    card.classList.add('jogador-card', `jogador-${numeroJogador}`);
    card.style.backgroundColor = coresJogadores[indice];
    card.dataset.jogadorId = numeroJogador;
    card.textContent = `#${numeroJogador} ${nome}`;

    if (indice === 0) {
        card.classList.add('ativo');
    }

    listaJogadores.appendChild(card);
}

function proximoJogador() {
    const jogadores = document.querySelectorAll('.jogador-card');
    if (jogadores.length === 0) return;

    jogadores[jogadorAtual].classList.remove('ativo');
    jogadorAtual = (jogadorAtual + 1) % jogadores.length;
    jogadores[jogadorAtual].classList.add('ativo');
}

function atualizarVisibilidadeBotaoPlay() {
    const totalJogadores = listaJogadores.children.length;
    if (totalJogadores > 0) {
        buttonPlay.style.display = 'block';
    } else {
        buttonPlay.style.display = 'none';
    }
}

// Inicializa visibilidade do botão no carregamento da página
atualizarVisibilidadeBotaoPlay();

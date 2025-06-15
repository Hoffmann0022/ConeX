const cards = document.querySelectorAll('.card');
const overlay = document.querySelector('.overlay');

let activeCard = null;

function card_duvidas() {
  cards.forEach(function (card) {
    const closeButton = card.querySelector('.bi-x-lg');
    const options = card.querySelector('.grupo_opcoes');

    // Evento de clique no card
    card.addEventListener('click', function () {
      // Previne reabrir o mesmo card
      if (activeCard === card) return;

      // Fecha o card anterior (se houver)
      if (activeCard) {
        const prevClose = activeCard.querySelector('.bi-x-lg');
        const prevOptions = activeCard.querySelector('.grupo_opcoes');
        activeCard.classList.remove('active');
        activeCard.classList.add('disabled');
        prevClose.style.display = 'none';
        prevOptions.style.display = 'none';
      }

      // Abre o novo card
      activeCard = card;
      card.classList.add('active');
      card.classList.remove('disabled');
      overlay.style.display = 'block';
      closeButton.style.display = 'block';
      options.style.display = 'flex';
    });

    // Fecha ao clicar no botão de fechar
    closeButton.addEventListener('click', function (e) {
      e.stopPropagation(); // Evita reabrir o card ao clicar no botão
      fecharCard();
    });
  });

  // Fecha ao clicar no overlay
  overlay.addEventListener('click', function () {
    fecharCard();
  });

  function fecharCard() {
    if (activeCard) {
      const closeButton = activeCard.querySelector('.bi-x-lg');
      const options = activeCard.querySelector('.grupo_opcoes');

      activeCard.classList.remove('active');
      activeCard.classList.add('disabled');
      closeButton.style.display = 'none';
      options.style.display = 'none';
      overlay.style.display = 'none';
      activeCard = null;
    }
  }
}

card_duvidas();


// Função para voltar para a última página válida

function voltarParaUltimaPagina() {
    const ultimaPagina = localStorage.getItem('paginaValidaAnterior');
    const paginasValidas = ['lobby.html', 'pitStop.html', 'game.html'];

    // Se há uma página salva e ela é válida, redireciona
    if (ultimaPagina && paginasValidas.includes(ultimaPagina)) {
      window.location.href = './' + ultimaPagina;
    } else {
      // Se não há página válida salva, vai para um padrão
      window.location.href = './lobby.html';
    }
  }
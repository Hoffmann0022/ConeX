document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const overlay = document.querySelector('.overlay');
  let activeCard = null;

  if (!cards.length) {
      console.warn("No '.card' elements found. FAQ functionality may not work.");
      return;
  }
  if (!overlay) {
      console.error("'.overlay' element not found. The overlay for FAQ pop-ups is essential.");
      return;
  }

  const closeCard = () => {
      if (activeCard) {
          const closeButton = activeCard.querySelector('.bi-x-lg');
          const options = activeCard.querySelector('.grupo_opcoes');

          activeCard.classList.remove('active');
          activeCard.classList.add('disabled');
          if (closeButton) closeButton.style.display = 'none';
          if (options) options.style.display = 'none';
          overlay.style.display = 'none';
          activeCard = null;
      }
  };

  cards.forEach(card => {
      const closeButton = card.querySelector('.bi-x-lg');
      const options = card.querySelector('.grupo_opcoes');

      if (!closeButton) {
          console.warn("Close button (.bi-x-lg) not found for a card. Check HTML structure.");
          return;
      }
      if (!options) {
          console.warn("Options group (.grupo_opcoes) not found for a card. Check HTML structure.");
          return;
      }

      card.addEventListener('click', () => {
          if (activeCard === card) return;

          if (activeCard) {
              closeCard();
          }

          activeCard = card;
          card.classList.add('active');
          card.classList.remove('disabled');
          overlay.style.display = 'block';
          closeButton.style.display = 'block';
          options.style.display = 'flex';
      });

      closeButton.addEventListener('click', e => {
          e.stopPropagation();
          closeCard();
      });
  });

  overlay.addEventListener('click', () => {
      closeCard();
  });

  const returnToLastValidPage = () => {
      const lastPage = localStorage.getItem('paginaValidaAnterior');
      const validPages = ['lobby.html', 'pitStop.html', 'game.html'];

      if (lastPage && validPages.includes(lastPage)) {
          window.location.href = './' + lastPage;
      } else {
          window.location.href = './lobby.html';
      }
  };
});

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const overlay = document.querySelector('.overlay');
  let activeCard = null;

  // Elementos do FAQ
  const faqItems = document.querySelectorAll('.faq-item');

  // --- Validações Iniciais ---
  if (!cards.length) {
      console.warn("No '.card' elements found. FAQ card functionality may not work.");
  }
  if (!overlay) {
      console.error("'.overlay' element not found. The overlay for FAQ pop-ups is essential.");
  }

  // --- Lógica para Abrir/Fechar Cards (Dúvidas Detalhadas) ---
  const closeCard = () => {
      if (activeCard) {
          const closeButton = activeCard.querySelector('.bi-x-lg');
          const options = activeCard.querySelector('.grupo_opcoes');

          activeCard.classList.remove('active');
          activeCard.classList.add('disabled');
          if (closeButton) closeButton.style.display = 'none';
          if (options) options.style.display = 'none';
          if (overlay) overlay.style.display = 'none';
          activeCard = null;
      }
  };

  cards.forEach(card => {
      const closeButton = card.querySelector('.bi-x-lg');
      const options = card.querySelector('.grupo_opcoes');

      if (!closeButton) {
          console.warn("Close button (.bi-x-lg) not found for a card. Check HTML structure.");
          return;
      }
      if (!options) {
          console.warn("Options group (.grupo_opcoes) not found for a card. Check HTML structure.");
          return;
      }

      card.addEventListener('click', () => {
          if (activeCard === card) return;

          if (activeCard) {
              closeCard();
          }

          activeCard = card;
          card.classList.add('active');
          card.classList.remove('disabled');
          if (overlay) overlay.style.display = 'block';
          closeButton.style.display = 'block';
          options.style.display = 'flex';
      });

      closeButton.addEventListener('click', e => {
          e.stopPropagation();
          closeCard();
      });
  });

  if (overlay) {
      overlay.addEventListener('click', () => {
          closeCard();
      });
  }

  // --- Lógica para FAQ (Expansível/Retrátil) ---
  faqItems.forEach(item => {
      item.addEventListener('click', function() {
          this.classList.toggle('active');
      });
  });

  // --- Função de Navegação ---
  const returnToLastValidPage = () => {
      const lastPage = localStorage.getItem('paginaValidaAnterior');
      const validPages = ['lobby.html', 'pitStop.html', 'game.html'];

      if (lastPage && validPages.includes(lastPage)) {
          window.location.href = './' + lastPage;
      } else {
          window.location.href = './lobby.html';
      }
  };

  // Torna a função globalmente acessível
  window.voltarParaUltimaPagina = returnToLastValidPage; 
});
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
      console.error("'.overlay' element not found. The overlay for pop-ups is essential.");
      // Não retorna aqui, pois a funcionalidade de FAQ (abaixo) pode não precisar do overlay.
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
          if (overlay) overlay.style.display = 'none'; // Apenas esconde se o overlay existir
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
          if (activeCard === card) return; // Prevents reopening the same card

          if (activeCard) {
              closeCard(); // Closes previous card if open
          }

          // Opens the new card
          activeCard = card;
          card.classList.add('active');
          card.classList.remove('disabled');
          if (overlay) overlay.style.display = 'block'; // Shows overlay if it exists
          closeButton.style.display = 'block';
          options.style.display = 'flex';
      });

      closeButton.addEventListener('click', e => {
          e.stopPropagation(); // Prevents card from re-opening
          closeCard();
      });
  });

  if (overlay) { // Only add listener if overlay exists
      overlay.addEventListener('click', () => {
          closeCard();
      });
  }

  // --- Lógica para FAQ (Expansível/Retrátil) ---
  faqItems.forEach(item => {
      item.addEventListener('click', function() {
          this.classList.toggle('active'); // Toggles 'active' class for styling (e.g., expand/collapse)
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
});
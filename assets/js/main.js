// assets/js/main.js

/**
 * Navigates the user to the Pit-Stop page.
 */
function navigateToPitStop() {
  window.location.href = 'html/pitStop.html';
}

/**
* Navigates the user to the Lobby page.
*/
function navigateToLobby() {
  window.location.href = 'html/lobby.html';
}

/**
* Navigates the user to the Game page.
*/
function navigateToGame() {
  window.location.href = 'html/game.html';
}

/**
* Navigates the user to the Doubts/FAQ page.
*/
function navigateToDuvidas() {
  window.location.href = 'html/duvidas.html';
}

/**
* Navigates the user to the How To Play/Manual page.
*/
function navigateToHowToPlay() {
  window.location.href = 'html/howToPlay.html';
}

/**
* Navigates the user to the Cards page.
*/
function navigateToCards() {
  window.location.href = 'html/cards.html';
}

// Attach event listeners for global navigation elements if they exist on every page,
// or call specific functions from individual page scripts.
// For example, if you have a "Play Now" button on your index.html:
// document.addEventListener('DOMContentLoaded', () => {
//     const playNowButton = document.getElementById('playNowButton');
//     if (playNowButton) {
//         playNowButton.addEventListener('click', navigateToPitStop);
//     }
// });

// Similarly, for the global header buttons (logo and doubts):
// You'll likely include `index.js` in your HTML files and call these functions directly
// from `onclick` attributes or attach listeners in `DOMContentLoaded`.
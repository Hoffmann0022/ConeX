const boardSpace = document.querySelector('.board-space');
const boardSpaceBlue = document.querySelectorAll('.blue');
const boardSpaceGreen = document.querySelectorAll('.green');
const boardSpaceOrange = document.querySelectorAll('.orange');

export class Game {
  constructor(players, boardSize = 96) {
    this.players = players.map(p => ({ ...p, position: 0 }));
    this.boardSize = boardSize;
    this.currentPlayerIndex = 0;
    this.questions = [];
    this.cards = [];
  }

  setGameData({ questions, cards }) {
    this.questions = [...questions];
    this.cards = [...cards];
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  movePlayer(spaces) {
    const player = this.getCurrentPlayer();
    player.position = Math.min(player.position + spaces, this.boardSize);
    return player.position;
  }

  goBackOneSpace() {
    const player = this.getCurrentPlayer();
    player.position = Math.max(0, player.position - 1);
  }

  isGreen() {
    if ([...boardSpace].includes(boardSpaceBlue)) {
      console.log('boardSpace está entre os elementos azuis');
    }
  }

  isBlue(position) {
    return position % 11 === 0;
  }

  isRed(position) {
    return position % 5 === 0 && !this.isGreen(position) && !this.isBlue(position);
  }

  checkSpecialSpace(position) {
    if (position === 0) return 'none';
    if (this.isGreen()) return 'card';
    if (this.isBlue(position)) return 'question';
    if (this.isRed(position)) return 'back';
    return 'none';
  }

  drawCard() {
    if (this.cards.length === 0) return null;
    return this.cards.pop();
  }

  drawQuestion() {
    if (this.questions.length === 0) return null;
    return this.questions.pop();
  }

  answerQuestion(selected, correct) {
    const player = this.getCurrentPlayer();
    if (selected === correct) {
      return true;
    } else {
      player.position = Math.max(player.position - 4, 0);
      return false;
    }
  }

  hasWon() {
    return this.getCurrentPlayer().position >= this.boardSize;
  }
}


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
    alert('Go back 1 space');
    player.position = Math.max(player.position - 1, 0);
  }

  isGreen(position) {
    const target = document.querySelector(`.board-space[data-index='${position}']`);
    return target && target.classList.contains('green');
  }

  isBlue(position) {
    const target = document.querySelector(`.board-space[data-index='${position}']`);
    return target && target.classList.contains('blue');
  }

  isRed(position) {
    const target = document.querySelector(`.board-space[data-index='${position}']`);
    return target && target.classList.contains('orange');
  }


  checkSpecialSpace(position) {
    if (position === 0) return 'none';
    if (this.isGreen(position)) return 'card';
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
      player.position = Math.max(player.position + 2, 0);
      return true;
    } else {
      player.position = Math.max(player.position - 2, 0);
      return false;
    }
  }

  hasWon() {
    return this.getCurrentPlayer().position >= this.boardSize;
  }
}

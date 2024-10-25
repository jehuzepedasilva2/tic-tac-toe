const GameBoard = {
  board: [
    ["", "", ""], 
    ["", "", ""],
    ["", "", ""], 
  ],
  boundCheck: function(row, col) {
    return (
      row < this.board.length && 
      col < this.board[0].length &&
      row >= 0 && col >= 0
    );  
  },
  markSpot: function(row, col, mark) {
    if (this.boundCheck(row, col)) {
      this.board[row][col] = mark;
    }
    return this.checkIsWon(mark);
  },
  checkIsWon: function(mark) {
    return this.checkWinCols(mark) || this.checkWinRows(mark) || this.checkWinDiagonals(mark)
  },
  checkWinRows: function(mark) {
    let isWon = false;
    this.board.forEach(row => {
      const markCount = row.reduce((total, cell) => {
        return total + (cell === mark ? 1 : 0); // Count cells matching 'mark'
      }, 0);
      if (markCount === 3) {
        isWon = true;
      }
    });
    return isWon;
  },
  checkWinCols: function(mark) {
    let isWon = false;
    const transposedBoard = this.board[0].map((_, colIndex) => this.board.map(row => row[colIndex]));
    transposedBoard.forEach(column => {
      const markCount = column.reduce((total, cell) => total + (cell === mark ? 1 : 0), 0);
      if (markCount === 3) {
        isWon = true;
      }
    });
    return isWon;
  },
  checkWinDiagonals: function(mark) {
    const leftDiagonalWin = this.board.every((row, idx) => row[idx] === mark);
    const rightDiagonalWin = this.board.every((row, idx) => row[row.length - 1 - idx] === mark);
    return leftDiagonalWin || rightDiagonalWin;
  }
};

function createPlayer(name, mark) {
  return {
    name: name,
    mark: mark,
    gamesWon: 0,
    addToWon: function() {
      this.gamesWon++;
    }
  };
}

const OnePlay = {
  game: GameBoard, 
  player1: null,
  player2: null,
  setPlayer1: function(name, mark) {
    this.player1 = createPlayer(name, mark);
  },
  setPlayer2: function(name, mark) {
    this.player2 = createPlayer(name, mark);
  },
  currPlayer: 0,
  play: function(row, col) {
    let isWon1 = false;
    let isWon2 = false;
    if (this.currPlayer === 0) {
      this.currPlayer = 1;
      isWon1 = GameBoard.markSpot(row, col, this.player1.mark);
    } else {
      this.currPlayer = 0;
      isWon2 = GameBoard.markSpot(row, col, this.player2.mark);
    }
    if (isWon1) {
      alert(`${this.player1.name} wins!`)
    }
    if (isWon2) {
      alert(`${this.player2.name} wins!`)
    }
  }
};

const play = OnePlay;
const p1 = prompt("p1 name");
const p2 = prompt("p2 name");
game.setPlayer1(p1, "x");
game.setPlayer2(p2, "o");

const cachedDOM = {
  convertToID: function(row, col) {
    const rowLength = 3;
    return (row * rowLength) + col;
  },
  getColsDOM: document.querySelectorAll(".cols"),
  getBoardCell: function(row, col) {
    const id = this.convertToID(row, col);
    const cell = this.getColsDOM[id];
    return cell;
  },
  render: function(row, col, marker) {
    const cell = this.getBoardCell(row, col);
    cell.textContent = marker;
  }
}

const gameboard = {
  board: [
    ["", "", ""], 
    ["", "", ""],
    ["", "", ""], 
  ],
  resetBoard: function() {
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
  },
  boundCheck: function(row, col) {
    return (
      row < this.board.length && 
      col < this.board[0].length &&
      row >= 0 && col >= 0
    );  
  },
  markSpot: function(row, col, mark) {
    if (this.boundCheck(row, col) && this.board[row][col] === "") {
      this.board[row][col] = mark;
    }
    return this.checkIsWon(mark);
  },
  checkTie: function() {
    return this.board.flat().every(cell => cell !== "");
  },
  checkIsWon: function(mark) {
    return this.checkWinCols(mark) || this.checkWinRows(mark) || this.checkWinDiagonals(mark)
  },
  checkWinRows: function(mark) {
    let isWon = false;
    this.board.forEach(row => {
      const markCount = row.reduce((total, cell) => {
        return total + (cell === mark ? 1 : 0);
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

const play = {
  game: gameboard, 
  player1: null,
  player2: null,
  setPlayer1: function(name, mark) {
    this.player1 = createPlayer(name, mark);
  },
  setPlayer2: function(name, mark) {
    this.player2 = createPlayer(name, mark);
  },
  currPlayer: 0,
  checkWin: function(isWon1, isWon2) {
    if (isWon1) {
      alert(`${this.player1.name} wins!`)
    } 
    if (isWon2) {
      alert(`${this.player2.name} wins!`)
    }
    if (this.GameBoard.checkTie()) {
      alert("its a tie!")
    }
  },
  play: function(row, col) {
    let isWon1 = false;
    let isWon2 = false;
    if (this.currPlayer === 0) {
      this.currPlayer = 1;
      isWon1 = this.game.markSpot(row, col, this.player1.mark);
    } else {
      this.currPlayer = 0;
      isWon2 = this.game.markSpot(row, col, this.player2.mark);
    }
    this.checkWin(isWon1, isWon2);
  }
};

const changeDOM = {
  setAttributes: function(element, attributes) {
    for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  },
  oSVG: function() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgAttributes = {
      "xmlns": "http://www.w3.org/2000/svg",
      "height": "130px", 
      "viewBox": "0 -960 960 960",
      "width": "110px",
      "fill": "black", 
      "stroke": "currentColor", 
      "stroke-width": "60"
    };
    this.setAttributes(svg, svgAttributes);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const circleAttributes = {
      "cx": "480",
      "cy": "-480", 
      "r": "400", 
      "fill": "yellow"
    }
    this.setAttributes(circle, circleAttributes);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathAttributes = {
      "d": "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
    }
    this.setAttributes(path, pathAttributes);
    svg.appendChild(circle);
    svg.appendChild(path);
    return svg;
  },
  xSVG: function() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    const svgAttributes = {
      "xmlns": "http://www.w3.org/2000/svg",
      "height": "130px",
      "viewBox": "0 -960 960 960",
      "width": "130px",
      "fill": "black",
      "stroke":"currentColor",
      "stroke-width": "50",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    };
    this.setAttributes(svg, svgAttributes);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathAttributes = {
      "d": "M256-200L200-256 424-480 200-704l56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
    }
    this.setAttributes(path, pathAttributes);
    svg.appendChild(path)
    return svg;
  }
}

const cachedDOM = {
  change: changeDOM,
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
    if (marker === "x") {
      const x = this.change.xSVG();
      cell.appendChild(x);
    } else {
      const o = this.change.oSVG();
      cell.appendChild(o);
    }
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
  dom: cachedDOM,
  score: null,
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

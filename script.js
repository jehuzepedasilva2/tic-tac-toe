const addSVGs = {
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
  svgs: addSVGs,
  getColsDOM: document.querySelectorAll(".cols"),
  getSideButtons: document.querySelectorAll(".side-btn"),
  render: function(cell, marker) {
    if (marker === "x") {
      const x = this.svgs.xSVG();
      cell.appendChild(x);
    } else {
      const o = this.svgs.oSVG();
      cell.appendChild(o);
    }
  },
  resetBoard: function() {
    const cells = this.getColsDOM;
    cells.forEach(cell => {
      const svg = cell.querySelector("svg");
      if (svg !== null) {
        svg.remove();
      }
    });
  },
  resetSides: function() {
    const btns = this.getSideButtons;
    btns.forEach(btn => {
      btn.disabled = false;
      btn.style.cssText = "border: 2px solid white";
    });
  },
  reset: function() {
    this.resetBoard();
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
  isValidSpot: function(row, col) {
    return (
      row < this.board.length && 
      col < this.board[0].length &&
      row >= 0 && col >= 0 && 
      this.board[row][col] === ""
    );  
  },
  markSpot: function(row, col, mark) {
    if (this.isValidSpot(row, col)) {
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
  },
  isCenterOpen: function() {
    return this.isValidSpot(1, 1); // Returns true if the center spot is open
  },
  getOpenCorners: function() {
    const corners = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 2 }
    ];
    return corners.filter(corner => this.isValidSpot(corner.row, corner.col));
  }
};


function findWinningMove(mark) {
  // Loop through rows and columns to check if there's a winning spot
  const game = gameboard;
  for (let i = 0; i < 3; i++) {
      // Check rows
      if (game.board[i][0] === mark && game.board[i][1] === mark && game.isValidSpot(i, 2)) {
          return { row: i, col: 2 };
      } else if (game.board[i][0] === mark && game.board[i][2] === mark && game.isValidSpot(i, 1)) {
          return { row: i, col: 1 };
      } else if (game.board[i][1] === mark && game.board[i][2] === mark && game.isValidSpot(i, 0)) {
          return { row: i, col: 0 };
      }
      
      // Check columns
      if (game.board[0][i] === mark && game.board[1][i] === mark && game.isValidSpot(2, i)) {
          return { row: 2, col: i };
      } else if (game.board[0][i] === mark && game.board[2][i] === mark && game.isValidSpot(1, i)) {
          return { row: 1, col: i };
      } else if (game.board[1][i] === mark && game.board[2][i] === mark && game.isValidSpot(0, i)) {
          return { row: 0, col: i };
      }
  }

  // Check diagonals
  if (game.board[0][0] === mark && game.board[1][1] === mark && game.isValidSpot(2, 2)) {
      return { row: 2, col: 2 };
  } else if (game.board[0][0] === mark && game.board[2][2] === mark && game.isValidSpot(1, 1)) {
      return { row: 1, col: 1 };
  } else if (game.board[1][1] === mark && game.board[2][2] === mark && game.isValidSpot(0, 0)) {
      return { row: 0, col: 0 };
  } else if (game.board[0][2] === mark && game.board[1][1] === mark && game.isValidSpot(2, 0)) {
      return { row: 2, col: 0 };
  } else if (game.board[0][2] === mark && game.board[2][0] === mark && game.isValidSpot(1, 1)) {
      return { row: 1, col: 1 };
  } else if (game.board[1][1] === mark && game.board[2][0] === mark && game.isValidSpot(0, 2)) {
      return { row: 0, col: 2 };
  }

  return null;
}

function computer() {
  const dom = cachedDOM;
  const game = gameboard;
  let score = 0;
  let side = null;
  let mark= null;
  function getRandomInt(max=3) {
    return Math.floor(Math.random() * max)
  }
  function setMark(choice) {
    mark = choice;
  }
  function setSide(chosen) {
    side = chosen.querySelector("div:last-child");
  }
  function play() {
    if (game.checkTie()) {
      setTimeout(() => {
        alert("It's a tie!");
      }, 10);
      game.resetBoard();
      setTimeout(() => dom.reset(), 250);
      return;
    }
    let row = -1;
    let col = -1;
    // 1. Check for a winning move
    const winningMove = findWinningMove(mark);
    if (winningMove) {
        row = winningMove.row;
        col = winningMove.col;
    } else {
        // 2. Check to block opponent's winning move
        const opponentMark = mark === 'x' ? 'o' : 'x';
        const blockMove = findWinningMove(opponentMark);
        if (blockMove) {
            row = blockMove.row;
            col = blockMove.col;
        } else if (game.isCenterOpen()) {
            // 3. Take center if open
            row = 1;
            col = 1;
        } else {
            // 4. Choose a random corner if available
            const openCorners = game.getOpenCorners();
            if (openCorners.length > 0) {
                const randomCorner = openCorners[Math.floor(Math.random() * openCorners.length)];
                row = randomCorner.row;
                col = randomCorner.col;
            } else {
                // 5. Fallback to random available spot
                while (!game.isValidSpot(row, col)) {
                    row = getRandomInt();
                    col = getRandomInt();
                }
            }
        }
    }
    let isWon = game.markSpot(row, col, mark);
    const cells = dom.getColsDOM;
    let cell;
    Array.from(cells).forEach(c => {
        if (c.classList[0] === `col-${row}${col}`) {
            cell = c;
        }
    });
    dom.render(cell, mark);
    if (isWon) {
        score++;
        setTimeout(() => {
          alert("Computer wins!");
        }, 20);
        side.textContent = `${score}`;
        game.resetBoard();
        setTimeout(() => dom.reset(), 250);
    }
    if (game.checkTie()) {
      setTimeout(() => {
        alert("It's a tie!");
      }, 20);
      game.resetBoard();
      setTimeout(() => dom.reset(), 250);
    }
  }
  return {setSide, setMark, play};
}

function user() {
  const dom = cachedDOM;
  const game = gameboard;
  let score = 0;
  let mark = null;
  let side = null;
  function setMark(choice) {
    mark = choice;
  }
  function setSide(chosen) {
    side = chosen.querySelector("div:last-child");
  }
  function play(row, col, cell, fn) {
    if (game.checkTie()) {
      alert("Its a tie");
      game.reset();
      dom.resetBoard();
      return;
    }
    if (!game.isValidSpot(row, col)) {
      return;
    }
    dom.render(cell, mark);
    let isWon = game.markSpot(row, col, mark);
    if (isWon) {
      score++;
      setTimeout(() => {
        alert("You win!");
      }, 20);
      side.textContent = `${score}`;
      game.resetBoard();
      setTimeout(() => dom.reset(), 250);
    } else {
      setTimeout(fn, 250);
    }
  }
  return {setSide, setMark, play};
}

const events = {
  game: gameboard,
  dom: cachedDOM,
  user: user(),
  computer: computer(),
  getBoardCell: function(row, col) {
    const id = this.convertToID(row, col);
    const cell = cachedDOM.getColsDOM[id];
    return cell;
  },
  convertFromID: function(cellID) {
    const rowLength = 3;
    const row = Math.floor(cellID / rowLength);
    const col = cellID % rowLength;
    return { row, col };
  },
  setHandleCell: function() {
    this.dom.getColsDOM.forEach(cell => {
      cell.addEventListener("click", () => {
        const rowCol = this.convertFromID(cell.id);
        this.user.play(rowCol.row, rowCol.col, cell, this.computer.play);
      });
    });
  },
  setSides: function() {
    const btns = this.dom.getSideButtons;
    btns[0].addEventListener("click", () => {
      this.user.setMark("x");
      this.user.setSide(btns[0]);
      this.computer.setMark("o");
      this.computer.setSide(btns[1]);
      btns[0].style.cssText = "border-right: 2px solid red;"
      btns[1].disabled = true
      this.setHandleCell();
    })
    btns[1].addEventListener("click", () => {
      this.user.setMark("o");
      this.user.setSide(btns[1])
      this.computer.setMark("x");
      this.computer.setSide(btns[0])
      btns[1].style.cssText = "border-left: 2px solid red;"
      btns[0].disabled = true
      this.computer.play();
      this.setHandleCell();
    });
  },
}

events.setSides();
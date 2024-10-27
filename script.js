// TODO: Add a modal that announces tie, win, loss. Current one is not good lol

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
  getResetButton: document.querySelector(".reset"),
  getSelector: document.querySelector("select"),
  getFiller: document.querySelector(".filler"),
  getSelectWrapper: document.querySelector(".select-wrapper"),
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
    const sideBtn = this.getSideButtons;
   sideBtn.forEach(btn => {
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
  },
  isEmpty: function() {
    return this.board.flat().every(cell => cell === "");
  }, 
  undoMark: function(row, col) {
    this.board[row][col] = "";
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

function evaluateBoard(mark) {
  const game = gameboard;
  const opponentMark = mark === 'x' ? 'o' : 'x';

  // Check rows, columns, and diagonals for a winning condition
  for (let i = 0; i < 3; i++) {
    // Check rows
    if (game.board[i][0] === mark && game.board[i][1] === mark && game.board[i][2] === mark) {
      return 10;
    }
    if (game.board[i][0] === opponentMark && game.board[i][1] === opponentMark && game.board[i][2] === opponentMark) {
      return -10;
    }

    // Check columns
    if (game.board[0][i] === mark && game.board[1][i] === mark && game.board[2][i] === mark) {
      return 10;
    }
    if (game.board[0][i] === opponentMark && game.board[1][i] === opponentMark && game.board[2][i] === opponentMark) {
      return -10;
    }
  }

  // Check diagonals
  if (game.board[0][0] === mark && game.board[1][1] === mark && game.board[2][2] === mark) {
    return 10;
  }
  if (game.board[0][0] === opponentMark && game.board[1][1] === opponentMark && game.board[2][2] === opponentMark) {
    return -10;
  }
  if (game.board[0][2] === mark && game.board[1][1] === mark && game.board[2][0] === mark) {
    return 10;
  }
  if (game.board[0][2] === opponentMark && game.board[1][1] === opponentMark && game.board[2][0] === opponentMark) {
    return -10;
  }

  // No win or loss; return 0 for a neutral/tie state
  return 0;
}

function minimax(depth, isMaximizing, mark) {
  const game = gameboard;
  const opponentMark = mark === 'x' ? 'o' : 'x';
  const score = evaluateBoard(mark);

  // Base cases for ending recursion
  if (score === 10) return score - depth; // Winning move
  if (score === -10) return score + depth; // Losing move
  if (game.checkTie()) return 0; // Tie

  // Recursive case
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (game.isValidSpot(i, j)) {
          game.markSpot(i, j, mark);
          bestScore = Math.max(bestScore, minimax(depth + 1, false, mark));
          game.undoMark(i, j);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (game.isValidSpot(i, j)) {
          game.markSpot(i, j, opponentMark);
          bestScore = Math.min(bestScore, minimax(depth + 1, true, mark));
          game.undoMark(i, j);
        }
      }
    }
    return bestScore;
  }
}

function computer() {
  const dom = cachedDOM;
  const game = gameboard;
  let score = 0;
  let side = null;
  let mark = null;
  let isX = false;
  let difficultyLevel = "medium";

  function getRandomInt(max = 3) {
    return Math.floor(Math.random() * max);
  }

  function setDifficulty(diff) {
    difficultyLevel = diff;
  }

  function setScore(s="-") {
    score = s === "-" ? 0 : s;
    side.textContent = `${s}`;
  }

  function setMark(choice) {
    mark = choice;
    isX = mark === "x";
  }

  function setSide(chosen) {
    side = chosen.querySelector("div:last-child");
  }

  function play() {
    if (mark == null) { return; }
    if (game.checkTie()) {
      setTimeout(() => alert("It's a tie!"), 10);
      resetGame();
      return;
    }

    let row, col;
    if (difficultyLevel === "easy") {
      do {
        row = getRandomInt();
        col = getRandomInt();
      } while (!game.isValidSpot(row, col));
    } else if (difficultyLevel === "medium") {
      const winningMove = findWinningMove(mark);
      if (winningMove) {
        // 1. Winning move for computer
        ({ row, col } = winningMove);
      } else {
        // 2. Block opponent's winning move, or 3. Take center, or 4. Choose random corner, or 5. Fallback
        const opponentMark = mark === 'x' ? 'o' : 'x';
        const blockMove = findWinningMove(opponentMark);
        if (blockMove) {
          ({ row, col } = blockMove);
        } else if (game.isCenterOpen()) {
          if (game.isEmpty() && isX) {
            row = getRandomInt();
            col = getRandomInt();
          } else{
            [row, col] = [1, 1];
          }
        } else {
          const openCorners = game.getOpenCorners();
          if (openCorners.length > 0) {
            ({ row, col } = openCorners[Math.floor(Math.random() * openCorners.length)]);
          } else {
            // Random fallback
            do {
              row = getRandomInt();
              col = getRandomInt();
            } while (!game.isValidSpot(row, col));
          }
        }
      }
    } else {
      if (game.isEmpty() && isX) {
        const openCorners = game.getOpenCorners();
        ({ row, col } = openCorners[Math.floor(Math.random() * openCorners.length)]);
      } else {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (game.isValidSpot(i, j)) {
              game.markSpot(i, j, mark);
              let moveScore = minimax(0, false, mark);
              game.undoMark(i, j);
              if (moveScore > bestScore) {
                bestScore = moveScore;
                bestMove = { row: i, col: j };
              }
            }
          }
        }
        ({ row, col } = bestMove);
      }
    }

    const isWon = game.markSpot(row, col, mark);
    const cells = dom.getColsDOM;
    let cell;
    Array.from(cells).forEach(c => {
        if (c.classList[0] === `col-${row}${col}`) {
            cell = c;
        }
    });
    dom.render(cell, mark);

    if (isWon) {
      setTimeout(() => alert("Computer wins!"), 20);
      setScore(++score);
      resetGame();
      return;
    }

    // Check tie after move
    if (game.checkTie()) {
      setTimeout(() => alert("It's a tie!"), 20);
      resetGame();
    }
  }

  function resetGame() {
    game.resetBoard();
    setTimeout(() => dom.reset(), 250);
    if (isX) setTimeout(play, 250);
  }

  return { setSide, setMark, play, setScore, setDifficulty };
}

function user() {
  const dom = cachedDOM;
  const game = gameboard;
  let score = 0;
  let mark = null;
  let side = null;

  function setScore(s="-") {
    score = s === "-" ? 0 : s;
    side.textContent = `${s}`;
  }

  function setMark(choice) {
    mark = choice;
  }

  function setSide(chosen) {
    side = chosen.querySelector("div:last-child");
  }

  function play(row, col, cell, fn) {
    if (mark == null) { return; }
    if (!game.isValidSpot(row, col)) {
      return;
    }

    dom.render(cell, mark);
    let isWon = game.markSpot(row, col, mark);
    if (isWon) {
      setScore(++score);
      setTimeout(() => {
        alert("You win!");
        game.resetBoard();
        dom.reset();
      }, 20);
    } else if (game.checkTie()) {
      setTimeout(() => {
        alert("It's a tie!");
        game.resetBoard();
        dom.reset();
      }, 20);
    } else {
      setTimeout(fn, 250);
    }
  }

  return { setSide, setMark, play, setScore };
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
  sideButtonStatus: function(status) {
    const sideBtn = this.dom.getSideButtons;
    sideBtn.forEach(btn => {
      btn.disabled = status;
    })
  },
  handleSelector: function(selectVis, fillerVis, selectWrapperVis, fillerText="") {
    this.dom.getSelector.style.cssText = `visibility: ${selectVis};`;
    if (fillerText !== "") this.dom.getFiller.textContent = fillerText;
    this.dom.getFiller.style.cssText = `visibility: ${fillerVis};`;
    this.dom.getSelectWrapper.style.cssText = `visibility: ${selectWrapperVis};`
  },
  sideBtnHandler: function(userMark, userSideBtn, compMark, compSideBtn, style) {
    this.user.setMark(userMark);
    this.user.setSide(userSideBtn);
    this.computer.setMark(compMark);
    this.computer.setSide(compSideBtn);
    this.sideButtonStatus(true);
    this.setHandleCell();
    const diff = this.dom.getSelector.value;
    this.computer.setDifficulty(diff);
    this.handleSelector("hidden", "visible", "hidden", diff[0].toUpperCase() + diff.slice(1));
    if (compMark === "x") {
      this.computer.play();
      userSideBtn.style.cssText = style;
    } else {
      userSideBtn.style.cssText = style;
    }
  },
  setSides: function() {
    const sideBtn = this.dom.getSideButtons;
   sideBtn[0].addEventListener("click", () => this.sideBtnHandler("x", sideBtn[0], "o", sideBtn[1], "border-right: 4px solid #1dd3fa;"))
   sideBtn[1].addEventListener("click", () => this.sideBtnHandler("o", sideBtn[1], "x", sideBtn[0], "border-left: 4px solid #ff3333;"));
  },
  resetButton: function() {
    const resetBtn = this.dom.getResetButton;
    const sideBtn = this.dom.getSideButtons;
    resetBtn.addEventListener("click", () => {
      this.game.resetBoard();          // Reset the gameboard state
      this.dom.reset();                // Reset the DOM visuals
      this.user.setScore();            // Reset the user's score
      this.user.setMark(null);
      this.computer.setScore();        // Reset the computer's score
      this.computer.setMark(null)

      this.handleSelector("visible", "hidden", "visible")
  
      // Reset side buttons
      sideBtn.forEach(btn => {
        btn.disabled = false;                                  // Enable the side buttons
        btn.style.cssText = "border: 2px solid black;";        // Reset any custom styles
      });

      this.sideButtonStatus(false);    // Re-enable side button functionality
    });
  }
}

function playGame() {
    events.setSides();
    events.resetButton();
};

playGame();

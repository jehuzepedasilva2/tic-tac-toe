// TODO: Add a modal that announces tie, win, loss. Current one is not good lol
class GamePlaySVG {
  setAttributes(element, attributes) {
    for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }

  oSVG() {
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
  }

  xSVG() {
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

class CachedDOM extends GamePlaySVG {

  constructor() {
    super();
    this.getColsDOM = document.querySelectorAll(".cols");
    this.getSideButtons = document.querySelectorAll(".side-btn");
    this.getResetButton = document.querySelector(".reset");
    this.getSelector = document.querySelector("select");
    this.getFiller = document.querySelector(".filler");
    this.getSelectWrapper =  document.querySelector(".select-wrapper");
  }

  render(cell, marker) {
    if (marker === "x") {
      const x = this.xSVG();
      cell.appendChild(x);
    } else {
      const o = this.oSVG();
      cell.appendChild(o);
    }
  }

  resetBoard() {
    const cells = this.getColsDOM;
    cells.forEach(cell => {
      const svg = cell.querySelector("svg");
      if (svg !== null) {
        svg.remove();
      }
    });
  }

  resetSides() {
    const sideBtn = this.getSideButtons;
   sideBtn.forEach(btn => {
      btn.disabled = false;
      btn.style.cssText = "border: 2px solid white";
    });
  }

  reset() {
    this.resetBoard();
  }

}

class GameBoard {
  
  constructor() {
    this.board = [
      ["", "", ""], 
      ["", "", ""],
      ["", "", ""], 
    ];
  }

  resetBoard() {
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
  }

  isValidSpot(row, col) {
    return (
      row < this.board.length && 
      col < this.board[0].length &&
      row >= 0 && col >= 0 && 
      this.board[row][col] === ""
    );  
  }

  markSpot(row, col, mark) {
    if (this.isValidSpot(row, col)) {
      this.board[row][col] = mark;
    }
    return this.checkIsWon(mark);
  }

  checkTie() {
    return this.board.flat().every(cell => cell !== "");
  }

  checkIsWon(mark) {
    return this.checkWinCols(mark) || this.checkWinRows(mark) || this.checkWinDiagonals(mark)
  }

  checkWinRows(mark) {
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
  }

  checkWinCols(mark) {
    let isWon = false;
    const transposedBoard = this.board[0].map((_, colIndex) => this.board.map(row => row[colIndex]));
    transposedBoard.forEach(column => {
      const markCount = column.reduce((total, cell) => total + (cell === mark ? 1 : 0), 0);
      if (markCount === 3) {
        isWon = true;
      }
    });
    return isWon;
  }

  checkWinDiagonals(mark) {
    const leftDiagonalWin = this.board.every((row, idx) => row[idx] === mark);
    const rightDiagonalWin = this.board.every((row, idx) => row[row.length - 1 - idx] === mark);
    return leftDiagonalWin || rightDiagonalWin;
  }

  isCenterOpen() {
    return this.isValidSpot(1, 1);
  }

  getOpenCorners() {
    const corners = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 2 }
    ];
    return corners.filter(corner => this.isValidSpot(corner.row, corner.col));
  }

  isEmpty() {
    return this.board.flat().every(cell => cell === "");
  }

  undoMark(row, col) {
    this.board[row][col] = "";
  }
}


class ComputerStrategies {

  constructor(gameBoard) {
    this.gameBoard = gameBoard;
  }

  findWinningMove(mark) {
    for (let i = 0; i < 3; i++) {
        // Check rows
        if (this.gameBoard.board[i][0] === mark && this.gameBoard.board[i][1] === mark && this.gameBoard.isValidSpot(i, 2)) {
            return { row: i, col: 2 };
        } else if (this.gameBoard.board[i][0] === mark && this.gameBoard.board[i][2] === mark && this.gameBoard.isValidSpot(i, 1)) {
            return { row: i, col: 1 };
        } else if (this.gameBoard.board[i][1] === mark && this.gameBoard.board[i][2] === mark && this.gameBoard.isValidSpot(i, 0)) {
            return { row: i, col: 0 };
        }
        
        // Check columns
        if (this.gameBoard.board[0][i] === mark && this.gameBoard.board[1][i] === mark && this.gameBoard.isValidSpot(2, i)) {
            return { row: 2, col: i };
        } else if (this.gameBoard.board[0][i] === mark && this.gameBoard.board[2][i] === mark && this.gameBoard.isValidSpot(1, i)) {
            return { row: 1, col: i };
        } else if (this.gameBoard.board[1][i] === mark && this.gameBoard.board[2][i] === mark && this.gameBoard.isValidSpot(0, i)) {
            return { row: 0, col: i };
        }
    }
  
    // Check diagonals
    if (this.gameBoard.board[0][0] === mark && this.gameBoard.board[1][1] === mark && this.gameBoard.isValidSpot(2, 2)) {
        return { row: 2, col: 2 };
    } else if (this.gameBoard.board[0][0] === mark && this.gameBoard.board[2][2] === mark && this.gameBoard.isValidSpot(1, 1)) {
        return { row: 1, col: 1 };
    } else if (this.gameBoard.board[1][1] === mark && this.gameBoard.board[2][2] === mark && this.gameBoard.isValidSpot(0, 0)) {
        return { row: 0, col: 0 };
    } else if (this.gameBoard.board[0][2] === mark && this.gameBoard.board[1][1] === mark && this.gameBoard.isValidSpot(2, 0)) {
        return { row: 2, col: 0 };
    } else if (this.gameBoard.board[0][2] === mark && this.gameBoard.board[2][0] === mark && this.gameBoard.isValidSpot(1, 1)) {
        return { row: 1, col: 1 };
    } else if (this.gameBoard.board[1][1] === mark && this.gameBoard.board[2][0] === mark && this.gameBoard.isValidSpot(0, 2)) {
        return { row: 0, col: 2 };
    }
  
    return null;
  }

  evaluateBoard(mark) {
    const opponentMark = mark === 'x' ? 'o' : 'x';
  
    // Check rows, columns, and diagonals for a winning condition
    for (let i = 0; i < 3; i++) {
      // Check rows
      if (this.gameBoard.board[i][0] === mark && this.gameBoard.board[i][1] === mark && this.gameBoard.board[i][2] === mark) {
        return 10;
      }
      if (this.gameBoard.board[i][0] === opponentMark && this.gameBoard.board[i][1] === opponentMark && this.gameBoard.board[i][2] === opponentMark) {
        return -10;
      }
  
      // Check columns
      if (this.gameBoard.board[0][i] === mark && this.gameBoard.board[1][i] === mark && this.gameBoard.board[2][i] === mark) {
        return 10;
      }
      if (this.gameBoard.board[0][i] === opponentMark && this.gameBoard.board[1][i] === opponentMark && this.gameBoard.board[2][i] === opponentMark) {
        return -10;
      }
    }
  
    // Check diagonals
    if (this.gameBoard.board[0][0] === mark && this.gameBoard.board[1][1] === mark && this.gameBoard.board[2][2] === mark) {
      return 10;
    }
    if (this.gameBoard.board[0][0] === opponentMark && this.gameBoard.board[1][1] === opponentMark && this.gameBoard.board[2][2] === opponentMark) {
      return -10;
    }
    if (this.gameBoard.board[0][2] === mark && this.gameBoard.board[1][1] === mark && this.gameBoard.board[2][0] === mark) {
      return 10;
    }
    if (this.gameBoard.board[0][2] === opponentMark && this.gameBoard.board[1][1] === opponentMark && this.gameBoard.board[2][0] === opponentMark) {
      return -10;
    }
  
    // No win or loss; return 0 for a neutral/tie state
    return 0;
  }

  minimax(depth, isMaximizing, mark) {
    const opponentMark = mark === 'x' ? 'o' : 'x';
    const score = this.evaluateBoard(mark);
  
    // Base cases for ending recursion
    if (score === 10) return score - depth; // Winning move
    if (score === -10) return score + depth; // Losing move
    if (this.gameBoard.checkTie()) return 0; // Tie
  
    // Recursive case
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.gameBoard.isValidSpot(i, j)) {
            this.gameBoard.markSpot(i, j, mark);
            bestScore = Math.max(bestScore, this.minimax(depth + 1, false, mark));
            this.gameBoard.undoMark(i, j);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.gameBoard.isValidSpot(i, j)) {
            this.gameBoard.markSpot(i, j, opponentMark);
            bestScore = Math.min(bestScore, this.minimax(depth + 1, true, mark));
            this.gameBoard.undoMark(i, j);
          }
        }
      }
      return bestScore;
    }
  }

}

class Computer extends ComputerStrategies {

  constructor(gameBoard) {
    super(gameBoard);
    this.gameBoard = gameBoard;
    this.dom = new CachedDOM();
    this.score = 0;
    this.side = null;
    this.mark = null;
    this.isX = false;
    this.difficultyLevel = "medium";
  }

  getRandomInt(max = 3) {
    return Math.floor(Math.random() * max);
  }

  setDifficulty(diff) {
    this.difficultyLevel = diff;
  }

  setScore(s="-") {
    this.score = s === "-" ? 0 : s;
    this.side.textContent = `${s}`;
  }

  setMark(choice) {
    this.mark = choice;
    this.isX = this.mark === "x";
  }

  setSide(chosen) {
    this.side = chosen.querySelector("div:last-child");
  }

  play() {
    if (this.mark == null) { return; }
    if (this.gameBoard.checkTie()) {
      setTimeout(() => alert("It's a tie!"), 10);
      resetGame();
      return;
    }

    let row, col;
    if (this.difficultyLevel === "easy") {
      do {
        row = this.getRandomInt();
        col = this.getRandomInt();
      } while (!this.gameBoard.isValidSpot(row, col));
    } else if (this.difficultyLevel === "medium") {
      const winningMove = this.findWinningMove(this.mark);
      if (winningMove) {
        // 1. Winning move for computer
        ({ row, col } = winningMove);
      } else {
        // 2. Block opponent's winning move, or 3. Take center, or 4. Choose random corner, or 5. Fallback
        const opponentMark = this.mark === 'x' ? 'o' : 'x';
        const blockMove = this.findWinningMove(opponentMark);
        if (blockMove) {
          ({ row, col } = blockMove);
        } else if (this.gameBoard.isCenterOpen()) {
          if (this.gameBoard.isEmpty() && this.isX) {
            row = this.getRandomInt();
            col = this.getRandomInt();
          } else{
            [row, col] = [1, 1];
          }
        } else {
          const openCorners = this.gameBoard.getOpenCorners();
          if (openCorners.length > 0) {
            ({ row, col } = openCorners[Math.floor(Math.random() * openCorners.length)]);
          } else {
            // Random fallback
            do {
              row = this.getRandomInt();
              col = this.getRandomInt();
            } while (!this.gameBoard.isValidSpot(row, col));
          }
        }
      }
    } else {
      if (this.gameBoard.isEmpty() && this.isX) {
        const openCorners = this.gameBoard.getOpenCorners();
        ({ row, col } = openCorners[Math.floor(Math.random() * openCorners.length)]);
      } else {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (this.gameBoard.isValidSpot(i, j)) {
              this.gameBoard.markSpot(i, j, this.mark);
              let moveScore = this.minimax(0, false, this.mark);
              this.gameBoard.undoMark(i, j);
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

    const isWon = this.gameBoard.markSpot(row, col, this.mark);
    const cells = this.dom.getColsDOM;
    let cell;
    Array.from(cells).forEach(c => {
        if (c.classList[0] === `col-${row}${col}`) {
            cell = c;
        }
    });
    this.dom.render(cell, this.mark);

    if (isWon) {
      setTimeout(() => alert("Computer wins!"), 20);
      this.setScore(++this.score);
      this.resetGame();
      return;
    }

    // Check tie after move
    if (this.gameBoard.checkTie()) {
      setTimeout(() => alert("It's a tie!"), 20);
      this.resetGame();
    }
  }

  resetGame() {
    this.gameBoard.resetBoard();
    setTimeout(() => this.dom.reset(), 250);
    if (this.isX) setTimeout(() => this.play(), 250);
  }

}

class User {

  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.dom = new CachedDOM();
    this.score = 0;
    this.mark = null;
    this.side = null;
  }

  setScore(s="-") {
    this.score = s === "-" ? 0 : s;
    this.side.textContent = `${s}`;
  }

  setMark(choice) {
    this.mark = choice;
  }

  setSide(chosen) {
    this.side = chosen.querySelector("div:last-child");
  }

  play(row, col, cell, comp) {
    if (this.mark == null) { return; }
    if (!this.gameBoard.isValidSpot(row, col)) {
      return;
    }

    this.dom.render(cell, this.mark);
    let isWon = this.gameBoard.markSpot(row, col, this.mark);
    if (isWon) {
      this.setScore(++this.score);
      setTimeout(() => {
        alert("You win!");
        this.gameBoard.resetBoard();
        this.dom.reset();
      }, 20);
    } else if (this.gameBoard.checkTie()) {
      setTimeout(() => {
        alert("It's a tie!");
        this.gameBoard.resetBoard();
        this.dom.reset();
      }, 20);
    } else {
      setTimeout(comp.play(), 250);
    }
  }

}

class Events {

  constructor() {
    this.gameBoard = new GameBoard();
    this.dom = new CachedDOM();
    this.user = new User(this.gameBoard),
    this.computer = new Computer(this.gameBoard);
    this.setSides();
    this.resetButton();
  }

  convertFromID(cellID) {
    const rowLength = 3;
    const row = Math.floor(cellID / rowLength);
    const col = cellID % rowLength;
    return { row, col };
  }

  setHandleCell() {
    this.dom.getColsDOM.forEach(cell => {
      cell.addEventListener("click", () => {
        const rowCol = this.convertFromID(cell.id);
        this.user.play(rowCol.row, rowCol.col, cell, this.computer);
      });
    });
  }

  sideButtonStatus(status) {
    const sideBtn = this.dom.getSideButtons;
    sideBtn.forEach(btn => {
      btn.disabled = status;
    })
  }

  handleSelector(selectVis, fillerVis, selectWrapperVis, fillerText="") {
    this.dom.getSelector.style.cssText = `visibility: ${selectVis};`;
    if (fillerText !== "") this.dom.getFiller.textContent = fillerText;
    this.dom.getFiller.style.cssText = `visibility: ${fillerVis};`;
    this.dom.getSelectWrapper.style.cssText = `visibility: ${selectWrapperVis};`
  }

  sideBtnHandler(userMark, userSideBtn, compMark, compSideBtn, style) {
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
  }

  setSides() {
    const sideBtn = this.dom.getSideButtons;
    sideBtn[0].addEventListener("click", () => this.sideBtnHandler("x", sideBtn[0], "o", sideBtn[1], "border-right: 4px solid #1dd3fa;"))
    sideBtn[1].addEventListener("click", () => this.sideBtnHandler("o", sideBtn[1], "x", sideBtn[0], "border-left: 4px solid #ff3333;"));
  }

  resetButton() {
    const resetBtn = this.dom.getResetButton;
    const sideBtn = this.dom.getSideButtons;
    resetBtn.addEventListener("click", () => {
      this.gameBoard.resetBoard();          // Reset the gameboard state
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

new Events();

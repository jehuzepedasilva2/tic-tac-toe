# tic-tac-toe
1. You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself.
  >1. Your main goal here is to have as little global code as possible. Try tucking as much as you can inside factories. If you only need a single instance of something (e.g. the gameboard, the displayController etc.) then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances.
  >2. In this project, think carefully about where each bit of logic should reside. Each little piece of functionality should be able to fit in the game, player or gameboard objects. Take care to put them in “logical” places. Spending a little time brainstorming here can make your life much easier later!
  >3. If you’re having trouble, Building a house from the inside out is a great article that lays out a highly applicable example both of how you might approach tackling this project as well as how you might organize and structure your code.
3. Focus on getting a working game in the console first. Make sure you include logic that checks for when the game is over! You should be checking for all winning 3-in-a-rows and ties. Try to avoid thinking about the DOM and your HTML/CSS until your game is working.
4. Once you have a working console game, create an object that will handle the display/DOM logic. Write a function that will render the contents of the gameboard array to the webpage (for now, you can always just fill the gameboard array with "X"s and "O"s just to see what’s going on).
5. Write the functions that allow players to add marks to a specific spot on the board by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker). Don’t forget the logic that keeps players from playing in spots that are already taken!
6. Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end!

# for hard difficulty
Overview of Minimax
Maximizing and Minimizing: The algorithm assumes that one player (usually the computer) tries to maximize their score, while the opponent tries to minimize it. The computer, as the maximizing player, chooses moves that increase its chance of winning, while the opponent (minimizing player) does the opposite.
Recursive Exploration: Minimax explores all possible moves, then assigns a score to each move based on the likelihood of winning, losing, or tying.
Score Calculation: Scores are assigned to each outcome:
A win for the computer is given a high positive score (e.g., +10).
A loss for the computer is given a negative score (e.g., -10).
A tie is given a neutral score (0).
Depth Adjustment: The algorithm subtracts the depth from the score for each recursive call to favor faster wins and longer defenses.
Steps in the Minimax Algorithm
Here’s how the algorithm works in the context of your Tic-Tac-Toe implementation:

1. Base Case

At each step, Minimax checks if the board is in a terminal state (a win, loss, or tie):

If the board represents a win for the computer (maximizing player), it returns a score of 10 - depth.
If the board represents a loss for the computer (maximizing player), it returns a score of -10 + depth.
If the board is a tie, it returns 0.
2. Recursive Case

If the game is not in a terminal state:

The algorithm recursively explores all possible moves.
For each open spot on the board:
It temporarily places the current player’s mark (either maximizing or minimizing).
It then calls Minimax recursively with the opposite role (maximize becomes minimize and vice versa).
After the recursive call, the temporary move is undone to reset the board state.
Maximizing Player’s Turn:
The maximizing player (computer) tries to maximize their score by choosing the highest score among possible moves.
Minimizing Player’s Turn:
The minimizing player (opponent) tries to minimize the score by choosing the lowest score among possible moves.
Why It Works

Minimax evaluates each possible move, calculating the best (or least worst) outcome for each. This means the computer chooses the optimal move, assuming both it and the opponent play perfectly. For Tic-Tac-Toe, which has a limited number of moves, Minimax can calculate all outcomes to ensure the best possible move is made.

Minimax Code Walkthrough
Using your code as a reference, here’s a detailed breakdown:

```javascript
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


import React from 'react';

const Instructions = ({ value }) => {
  let textToShow;
  switch (value) {
    case 'tic-tac-toe':
      textToShow = (
        <div style={{display:"grid", gap:"4vh"}}>
          <div><strong>1. The game is played on a 3x3 grid,</strong> totaling 9 squares.</div>
          <div><strong>2. Players choose their symbols:</strong> one player is 'X' and the other is 'O'. The player who goes first alternates.</div>
          <div><strong>3. Players take turns placing their symbol (X or O)</strong> in an empty square on the grid.</div>
          <div><strong>4. The winner is the first to get three of their symbols</strong> in a row, either horizontally, vertically, or diagonally.</div>
          <div><strong>5. If all squares are filled without a winner,</strong> the game ends in a draw.</div>
          <div><strong>6. A quiz popup appears when the AI makes a move.</strong></div>
          <div><strong>7. The game will end if you answer incorrect or skip the question for 2 times in a quiz.</strong></div>
        </div>      );
      break;
    case '2048-game':
      textToShow = (
        <div style={{ display: "grid", gap: "4vh" }}>
        <div><strong>1. In this game, the player must combine tiles containing the same numbers</strong> until they reach the number 2048.</div>
        <div><strong>2. The tiles can contain only integer values starting from 2, and that are a power of two, like 2, 4, 8, 16, 32, and so on.</strong></div>
        <div><strong>3. Ideally, the player should reach the 2048 tile within the smallest number of steps.</strong></div>
        <div><strong>4. The board has a dimension of 4x4 tiles, so it can fit up to 16 tiles. If the board is full and there is no possible move left, the game is over.</strong></div>
        <div><strong>5. Quiz questions will appear periodically during gameplay.</strong></div>
        <div><strong>6. The game will end if you answer incorrect or skip the question for 2 times in a quiz.</strong></div>
      </div>
      );
      break;
    case 'slidding-puzzle':
      textToShow = (
        <div style={{ display: "grid", gap: "4vh" }}>
        <div><strong>1. In this sliding puzzle game, the player must rearrange tiles to form the correct order.</strong></div>
        <div><strong>2. The goal is to arrange the tiles in numerical order from 1 to 15, leaving the empty space in the last position.</strong></div>
        <div><strong>3. Click on any tile adjacent to the empty space to move it into the empty spot.</strong></div>
        <div><strong>4. Each brick broken scores points, and the game ends if the ball misses the paddle.</strong></div>
          <div><strong>5. Additionally, a quiz question pops up every 10 seconds during gameplay. Each quiz question has a timer of 5 seconds.</strong></div>
          <div><strong>6. The game will end if you answer incorrect or skip the question for 2 times in a quiz.</strong></div> 
      </div>

      );
      break;
    case 'bricks-mania':
      textToShow = (
        <div style={{display:"grid", gap:"4vh"}}>
          <div><strong>1. In Bricks Mania, the objective is to break all the bricks by bouncing the ball off the paddle.</strong></div>
          <div><strong>2. The player moves the paddle horizontally using the left and right arrow keys.</strong></div>
          <div><strong>3. The ball automatically bounces off walls, the paddle, and bricks.</strong></div>
          <div><strong>4. Each brick broken scores points, and the game ends if the ball misses the paddle.</strong></div>
          <div><strong>5. Additionally, a quiz question pops up every 10 seconds during gameplay. Each quiz question has a timer of 5 seconds.</strong></div>
          <div><strong>6. The game will end if you answer incorrect or skip the question for 2 times in a quiz.</strong></div>
        </div>
      );
      break;
    default:
      textToShow = <p>Loading Instructions</p>;
      break;
  }

  return (
    <div style={{textAlign:"start"}}>
      {textToShow}
    </div>
  );
};

export default Instructions;

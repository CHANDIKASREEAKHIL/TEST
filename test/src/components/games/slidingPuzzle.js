import React, { useState, useEffect } from "react";
import styles from "./games.module.css";
import LoginHeader from "../header/LoginHeader";
import WriteExam from "../Quiz";

const SlidingPuzzle = () => {
  const [board, setBoard] = useState([]);
  const [emptyTile, setEmptyTile] = useState(15);
  const [score, setScore] = useState(0);

  const [lifeLine, setLifeLine] = useState(2);

  const updateLifeLine = (newLifeLine) => {
    console.log("Lifeline changed : ",newLifeLine);
    setLifeLine(newLifeLine);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  useEffect(() => {
    calculateScore();
  }, [board]);

  const initializeBoard = () => {
    const tiles = Array.from({ length: 16 }, (_, index) => index);
    const shuffledTiles = shuffle(tiles);
    setBoard(shuffledTiles);
    setEmptyTile(shuffledTiles.indexOf(15));
    calculateScore(shuffledTiles);
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleTileClick = (index) => {
    if (canMove(index)) {
      const newBoard = [...board];
      newBoard[emptyTile] = newBoard[index];
      newBoard[index] = 15;
      setBoard(newBoard);
      setEmptyTile(index);
    }
  };

  const canMove = (index) => {
    const emptyRow = Math.floor(emptyTile / 4);
    const emptyCol = emptyTile % 4;
    const row = Math.floor(index / 4);
    const col = index % 4;
    return (
      (Math.abs(emptyRow - row) === 1 && emptyCol === col) ||
      (Math.abs(emptyCol - col) === 1 && emptyRow === row)
    );
  };

  const calculateScore = (currentBoard = board) => {
    let currentScore = 0;
    currentBoard.forEach((tile, index) => {
      if (tile === index) {
        currentScore++;
      }
    });
    setScore(currentScore * 5);
  };

  const restartGame = () => {
    initializeBoard();
  };
  const [obtainedMarks, setObtainedMarks] = useState(0);

  const handleObtainedMarks = (marks) => {
    setObtainedMarks(marks);
  };

  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    setGameScore(score + obtainedMarks * 5);
  }, [score, obtainedMarks]);


  return (
    <div className={styles.mainDiv}>
      <LoginHeader />
      <div style={{ margin:"0vh 5vw", display:"flex", gap:"2vw"}}>
      <WriteExam onObtainedMarks={handleObtainedMarks} gameScore={score} updateLifeLine={updateLifeLine} perQue={5} />
      <button style={{placeSelf:"flex-end"}} className={styles.gameButton} onClick={restartGame}>
          Restart
        </button>
        </div>
        <div className="heart-container">
        <h3>
                LifeLines : 
                {lifeLine === 0
  ? 0
  : Array.from({ length: lifeLine }, (_, index) => (
      <span key={index} className="heart-symbol">❤️</span>
    ))}
    </h3>
            </div>
      <div style={{display:"grid", gridTemplateRows:"min-content min-content"}}>
      <h4>Score: {score}</h4>
        <div className={styles["sliding-puzzle"]}>
          <div className={styles["puzzle-board"]}>
            {board.map((tile, index) => (
              <div
                key={index}
                className={`${styles.tile} ${tile === 15 ? styles["tile-empty"] : ""}`}
                onClick={() => handleTileClick(index)}
              >
                {tile !== 15 ? tile + 1 : ""}
              </div>
            ))}
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
};

export default SlidingPuzzle;

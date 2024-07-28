import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./games.module.css";
import LoginHeader from "../header/LoginHeader";
import { toast } from "react-toastify";
import animationData from "./animation.json";
import Lottie from 'react-lottie';
import WriteExam from "../Quiz";


export default function Game2048() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const [board, setBoard] = useState(
    Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0))
  );
  const [score, setScore] = useState(0);
  const [lifeLine, setLifeLine] = useState(2);

  const updateLifeLine = (newLifeLine) => {
    console.log("Lifeline changed : ",newLifeLine);
    setLifeLine(newLifeLine);
  };
 const gameOverRef = useRef(false);
  const checkGameOver = useCallback(() => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          return false;
        }
      }
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          (i < board.length - 1 && board[i][j] === board[i + 1][j]) ||
          (j < board[i].length - 1 && board[i][j] === board[i][j + 1])
        ) {
          return false;
        }
      }
    }
    return true;
  }, [board]);

  
  // const checkGameOver = () => {
  //   // Check for available moves
  //   for (let i = 0; i < board.length; i++) {
  //     for (let j = 0; j < board[i].length; j++) {
  //       if (board[i][j] === null) {
  //         return false; // If any cell is empty, game is not over
  //       }
  //       // Check adjacent cells (left, right, up, down)
  //       if (i > 0 && board[i][j] === board[i - 1][j]) {
  //         return false;
  //       }
  //       if (i < board.length - 1 && board[i][j] === board[i + 1][j]) {
  //         return false;
  //       }
  //       if (j > 0 && board[i][j] === board[i][j - 1]) {
  //         return false;
  //       }
  //       if (j < board[i].length - 1 && board[i][j] === board[i][j + 1]) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true; // No available moves left, game over
  // };

  useEffect(() => {
    if (checkGameOver()) {
      gameOverRef.current = true;     
    }
  }, [board]);

  

  const restartGame = () => {
    setBoard(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null)));
    setScore(0);
    generateRandomTile();
    generateRandomTile();
    gameOverRef.current = false; 
  };  

  const generateRandomTile = useCallback(() => {
    let emptyTiles = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length === 0) {
      // setGameOver(true);
      gameOverRef.current = true; // Update gameOver using useRef
      return;
    }
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const newValue = Math.random() < 0.9 ? 2 : 4;
    const { x, y } = emptyTiles[randomIndex];
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[x][y] = newValue;
      return newBoard;
    });
    // setGameOver(checkGameOver());
    gameOverRef.current = checkGameOver(); // Update gameOver using useRef
  }, [board, checkGameOver]);



  const handleKeyDown = useCallback(
    (e) => {
      // if (!gameOver) {
      if (!gameOverRef.current) {
        e.preventDefault();
        let moved = false;
        const newBoard = [...board];
        

        switch (e.key) {
          case "ArrowUp":
            for (let j = 0; j < newBoard.length; j++) {
              for (let i = 1; i < newBoard.length; i++) {
                if (newBoard[i][j] !== 0) {
                  let k = i - 1;
                  while (k >= 0 && newBoard[k][j] === 0) {
                    k--;
                  }
                  if (k >= 0 && newBoard[k][j] === newBoard[i][j]) {
                    newBoard[k][j] *= 2;
                    setScore((prevScore) => prevScore + newBoard[k][j]);
                    newBoard[i][j] = 0;
                    moved = true;
                  } else if (k + 1 !== i) {
                    newBoard[k + 1][j] = newBoard[i][j];
                    newBoard[i][j] = 0;
                    moved = true;
                  }
                }
              }
            }
            break;
          case "ArrowDown":
            for (let j = 0; j < newBoard.length; j++) {
              for (let i = newBoard.length - 2; i >= 0; i--) {
                if (newBoard[i][j] !== 0) {
                  let k = i + 1;
                  while (k < newBoard.length && newBoard[k][j] === 0) {
                    k++;
                  }
                  if (
                    k < newBoard.length &&
                    newBoard[k][j] === newBoard[i][j]
                  ) {
                    newBoard[k][j] *= 2;
                    setScore((prevScore) => prevScore + newBoard[k][j]);
                    newBoard[i][j] = 0;
                    moved = true;
                  } else if (k - 1 !== i) {
                    newBoard[k - 1][j] = newBoard[i][j];
                    newBoard[i][j] = 0;
                    moved = true;
                  }
                }
              }
            }
            break;
          case "ArrowLeft":
            for (let i = 0; i < newBoard.length; i++) {
              for (let j = 1; j < newBoard[i].length; j++) {
                if (newBoard[i][j] !== 0) {
                  let k = j - 1;
                  while (k >= 0 && newBoard[i][k] === 0) {
                    k--;
                  }
                  if (k >= 0 && newBoard[i][k] === newBoard[i][j]) {
                    newBoard[i][k] *= 2;
                    setScore((prevScore) => prevScore + newBoard[i][k]);
                    newBoard[i][j] = 0;
                    moved = true;
                  } else if (k + 1 !== j) {
                    newBoard[i][k + 1] = newBoard[i][j];
                    newBoard[i][j] = 0;
                    moved = true;
                  }
                }
              }
            }
            break;
          case "ArrowRight":
            for (let i = 0; i < newBoard.length; i++) {
              for (let j = newBoard[i].length - 2; j >= 0; j--) {
                if (newBoard[i][j] !== 0) {
                  let k = j + 1;
                  while (k < newBoard[i].length && newBoard[i][k] === 0) {
                    k++;
                  }
                  if (
                    k < newBoard[i].length &&
                    newBoard[i][k] === newBoard[i][j]
                  ) {
                    newBoard[i][k] *= 2;
                    setScore((prevScore) => prevScore + newBoard[i][k]);
                    newBoard[i][j] = 0;
                    moved = true;
                  } else if (k - 1 !== j) {
                    newBoard[i][k - 1] = newBoard[i][j];
                    newBoard[i][j] = 0;
                    moved = true;
                  }
                }
              }
            }
            break;
          default:
            return;
        }

        if (moved) {
          setBoard(newBoard);
          generateRandomTile();
          // setGameOver(checkGameOver());
          gameOverRef.current = checkGameOver(); // Update gameOver using useRef
          if (gameOverRef.current) {
            toast.error(`Game Over! Final Score: ${score}`,{
              position: "top-center",
          });
          }
        }
      }
    },
    [board, checkGameOver, generateRandomTile, score]
  );

  useEffect(() => {
    generateRandomTile();
    generateRandomTile();
  }, []);

  const redirectMain = () => {
    window.location.href = "/#/home";
  };
  

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const [obtainedMarks, setObtainedMarks] = useState(0);

  const handleObtainedMarks = (marks) => {
    setObtainedMarks(marks);
  };

  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    setGameScore(score + 0);
  }, [score, obtainedMarks]);

  return (
    <div className={styles.mainDiv}>
      <LoginHeader height ={3} />
        <div style={{margin:"0vh 5vw"}}>
          <WriteExam onObtainedMarks={handleObtainedMarks} gameScore={gameScore} updateLifeLine={updateLifeLine} perQue={5} />
        </div>
      <div className={styles.innerGrid} style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className={styles['game2048-container']}>
          <div className={styles.inSections}>
            {!checkGameOver() ? (
            <div className={styles["game-board"]}>
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className={styles["board-row"]}>
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`${styles['board-cell']} ${styles[`value-${cell !== 0 ? cell : 'empty'}`]}`}
                    >
                      {cell !== 0 ? cell : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            ) : (<><h1 style={{fontSize:"8vh"}}>Game Over!</h1>
             <Lottie options={defaultOptions}
              height={300}
              width={300}
      />

              </>)}
          </div>
        </div>
        <div className={styles.inRightSections}>
          <div className={styles["right-board"]}>
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
          <div>
            <h1 >Score</h1>
            <h1 style={{fontSize:"12vh"}}>{score}</h1>

            {gameOverRef.current && <div> <h1 style={{fontSize:"8vh"}}>Game Over!</h1>
            <h1 style={{fontSize:"4vh"}}>Click Here to Restart</h1></div>}
          </div>
          <div style={{display:"flex", gap:"1vw"}}>
          <button style={{ placeSelf: "center", width:"70%"}} className={styles.gameButton} onClick={restartGame}>
              Restart
            </button>
          <button style={{ placeSelf: "center", width:"70%"}} className={styles.gameButton} onClick={redirectMain}>
              Go Back
            </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}

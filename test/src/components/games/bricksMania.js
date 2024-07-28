import React, { useState, useEffect, useRef } from "react";
import styles from "./games.module.css";
import LoginHeader from "../header/LoginHeader";
import WriteExam from "../Quiz";

const BrickBreaker = () => {
  const [paddlePosition, setPaddlePosition] = useState(200); // Adjusted for centering
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 290 });
  const [ballVelocity, setBallVelocity] = useState({ dx: 2, dy: -2 });
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const gameContainerRef = useRef(null);

  const [lifeLine, setLifeLine] = useState(2);

  const updateLifeLine = (newLifeLine) => {
    console.log("Lifeline changed : ",newLifeLine);
    setLifeLine(newLifeLine);
  };

  useEffect(() => {
    const initializeBricks = () => {
      const rows = 5;
      const columns = 7;
      const brickWidth = 75;
      const brickHeight = 20;
      const brickPadding = 10;
      const offsetTop = 30;
      const offsetLeft = (gameContainerRef.current.offsetWidth - (columns * (brickWidth + brickPadding) - brickPadding)) / 2; // Center bricks
      const newBricks = [];

      for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
          newBricks.push({
            x: c * (brickWidth + brickPadding) + offsetLeft,
            y: r * (brickHeight + brickPadding) + offsetTop,
            status: 1,
          });
        }
      }

      setBricks(newBricks);
    };

    initializeBricks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGamePaused || gameOver) return;

      const containerWidth = gameContainerRef.current.offsetWidth;
      const paddleWidth = 100;
      if (e.key === "ArrowLeft" && paddlePosition > 0) {
        setPaddlePosition(Math.max(paddlePosition - 20, 0));
      } else if (e.key === "ArrowRight" && paddlePosition < containerWidth - paddleWidth) {
        setPaddlePosition(Math.min(paddlePosition + 20, containerWidth - paddleWidth - 12));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paddlePosition, isGamePaused, gameOver]);

  useEffect(() => {
    if (gameOver || isGamePaused) {
      return;
    }

    const interval = setInterval(() => {
      const container = gameContainerRef.current;
      if (!container) return;

      let { x, y } = ballPosition;
      let { dx, dy } = ballVelocity;

      // Check for wall collisions
      if (x + dx > container.offsetWidth - 10 || x + dx < 0) dx = -dx;
      if (y + dy < 0) dy = -dy;

      // Check for paddle collision
      if (
        y + dy > container.offsetHeight - 30 &&
        x > paddlePosition &&
        x < paddlePosition + 100
      ) {
        dy = -dy;
      }

      // Check for brick collisions
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.status === 1) {
          if (x > b.x && x < b.x + 75 && y > b.y && y < b.y + 20) {
            dy = -dy;
            b.status = 0;
            setBricks([...bricks]);
            setScore(score + 5);
          }
        }
      }

      // Check for game over
      if (y + dy > container.offsetHeight - 10) {
        setGameOver(true);
        clearInterval(interval); // Stop interval on game over
      }

      setBallPosition({ x: x + dx, y: y + dy });
      setBallVelocity({ dx, dy });
    }, 10);

    return () => clearInterval(interval);
  }, [ballPosition, ballVelocity, paddlePosition, bricks, gameOver, isGamePaused]);

  const restartGame = () => {
    setPaddlePosition(200); // Reset to initial position
    setBallPosition({ x: 290, y: 290 });
    setBallVelocity({ dx: 2, dy: -2 });
    setGameOver(false);
    setScore(0);
    
    const initializeBricks = () => {
      const rows = 5;
      const columns = 7;
      const brickWidth = 75;
      const brickHeight = 20;
      const brickPadding = 10;
      const offsetTop = 30;
      const offsetLeft = (gameContainerRef.current.offsetWidth - (columns * (brickWidth + brickPadding) - brickPadding)) / 2; // Center bricks
      const newBricks = [];

      for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
          newBricks.push({
            x: c * (brickWidth + brickPadding) + offsetLeft,
            y: r * (brickHeight + brickPadding) + offsetTop,
            status: 1,
          });
        }
      }

      setBricks(newBricks);
    };

    initializeBricks();
  };

  const [obtainedMarks, setObtainedMarks] = useState(0);

  const handleObtainedMarks = (marks) => {
    setObtainedMarks(marks);
  };

  const handleModalVisibility = (isVisible) => {
    setIsGamePaused(isVisible);
  };

  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    setGameScore(score);
  }, [score, obtainedMarks]);

  return (
    <div className={styles.mainDiv}>
      <LoginHeader height={3} />
      <div style={{ margin: "0vh 5vw" }}>
        <WriteExam onObtainedMarks={handleObtainedMarks} onModalVisibilityChange={handleModalVisibility} gameScore={score} updateLifeLine={updateLifeLine} perQue={5} />
      </div>
      <div className="heart-container">
              <h3>  LifeLines : 
                {lifeLine === 0
  ? 0
  : Array.from({ length: lifeLine }, (_, index) => (
      <span key={index} className="heart-symbol">❤️</span>
    ))}
    </h3>
            </div>
      <div className={styles.innerGrid} style={{gap:"0vw", padding:"0vh 3vw 0vh 8vw", gridTemplateRows:"min-content"}}>
      {!gameOver && (<h3>Score: {score}</h3>)}
        <div className={styles["game-container"]} ref={gameContainerRef}>
          <div className={styles.paddle} style={{ left: paddlePosition }}></div>
          <div
            className={styles.ball}
            style={{ left: ballPosition.x, top: ballPosition.y }}
          ></div>
          {!gameOver ? (
            <>
              {bricks.map((brick, index) =>
                brick.status === 1 ? (
                  <div
                    key={index}
                    className={styles.brick}
                    style={{ left: brick.x, top: brick.y }}
                  ></div>
                ) : null
              )}
            </>
          ) : (
            <>
              <h1>Game Over!</h1>
            <h2>Score: {score}</h2>
              <button className={styles.gameButton} onClick={restartGame}>
                Restart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrickBreaker;

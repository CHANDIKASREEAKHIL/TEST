import React, { useState, useRef, useEffect } from "react";
import styles from "./dashboard.module.css";
import Instructions from "./instruction";
import LoginHeader from "../header/LoginHeader";

const games = [
  { id: "bricks-mania", name: "Bricks Mania", image: require("../../images/ballBrick.png"), width: "25vw" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", image: require("../../images/tic-tac-toe.png"), width: "25vw" },
  { id: "2048-game", name: "2048 Puzzle Game", image: require("../../images/2048.png"), width: "30vw" },
  { id: "slidding-puzzle", name: "Sliding Puzzle", image: require("../../images/puzzle.png"), width: "25vw" },
];

function Dashboard() {
  const [instruction, setInstruction] = useState(false);
  const [instructionValue, setInstructionValue] = useState("");
  const innerGridRef = useRef(null);

  useEffect(() => {
    const middleIndex = Math.floor(games.length / 2) - 1.5 ;
    const scrollPosition = (innerGridRef.current.scrollWidth / games.length) * middleIndex;
    innerGridRef.current.scrollLeft = scrollPosition;
  }, []);

  const viewInstructions = (value) => {
    setInstruction(true);
    setInstructionValue(value);
  };

  const handleGame = (value) => {
    window.location.href = `/#/${value}`;
  };

  return (
    <div className={styles.mainDiv}>
      <LoginHeader height={3}/>
      <div
        className={styles.innerGrid}
        ref={innerGridRef}
        style={{
          gridTemplateColumns: !instruction ? "" : "1fr",
          padding: !instruction ? "" : "5vh 20vw 10vh 20vw"
        }}
      >
        {!instruction ? (
          games.map((game) => (
            <div key={game.id} className={styles.inSections}>
              <span className={styles.gameText}>{game.name}</span>
              <img
                src={game.image}
                alt={game.name}
                style={{ width: game.width, placeSelf: "center", margin: "auto 2vw" }}
              />
              <button
                className={styles.gameButton}
                style={{ placeSelf: "flex-start" }}
                onClick={() => viewInstructions(game.id)}
              >
                Play Game
              </button>
            </div>
          ))
        ) : (
          <div className={styles.inSections}>
            <div style={{ textAlign: "start", fontSize: "3vh", fontWeight: "500" }}>
              Instructions
            </div>
            <Instructions value={instructionValue} />
            <button
              className={styles.submitButton}
              style={{ placeSelf: "flex-end", alignSelf: "center" }}
              onClick={() => handleGame(instructionValue)}
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

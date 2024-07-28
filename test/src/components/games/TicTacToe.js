import React, { useState, useEffect } from "react";
import styles from "./games.module.css";
import LoginHeader from "../header/LoginHeader";
import useSound from "use-sound";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import Modal from "../Modal/modal";
import Lottie from "react-lottie";
import xImage from "../../images/x.png";
import oImage from "../../images/o.png";
import winSound from "../../sounds/win.wav";
import loseSound from "../../sounds/lost.wav";
import tieSound from "../../sounds/tie.wav";
import xSound from "../../sounds/x.wav";
import oSound from "../../sounds/o.wav";
import lost from "./lost.json";
import win from "./win.json";

const initialBoardState = Array(9).fill(null);

const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoardState);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [movesHistory, setMovesHistory] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [viewSet, setViewSet] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [internalTimer, setInternalTimer] = useState(5);
  const [user, setUser] = useState();
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [lastQuestion, setlastQuestion] = useState(false);

  const [playWinSound] = useSound(winSound);
  const [playLoseSound] = useSound(loseSound);
  const [playTieSound] = useSound(tieSound);
  const [playXSound] = useSound(xSound);
  const [playOSound] = useSound(oSound);

  const [lifeLine, setLifeLine] = useState(2);

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const getExamData = async () => {
      try {
        const quizRef = doc(db, "Quizzes", "tic-tac-toe");
        const quizSnapshot = await getDoc(quizRef);

        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.data();
          setExamData(quizData);

          const questionIds = quizData.question;
          const questionPromises = questionIds.map(async (questionId) => {
            const questionRef = doc(db, "Questions", questionId);
            const questionSnapshot = await getDoc(questionRef);
            return { ...questionSnapshot.data(), id: questionSnapshot.id };
          });

          const fetchedQuestions = await Promise.all(questionPromises);
          setQuestions(fetchedQuestions);
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    getExamData();
  }, []);

  const calculateWinner = (squares) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const minimax = (newBoard, player) => {
    const availSpots = newBoard.reduce((acc, cur, idx) => (cur === null ? acc.concat(idx) : acc), []);

    if (calculateWinner(newBoard) === "X") {
      return { score: -10 };
    } else if (calculateWinner(newBoard) === "O") {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[move.index] = player;

      if (player === "O") {
        const result = minimax(newBoard, "X");
        move.score = result.score;
      } else {
        const result = minimax(newBoard, "O");
        move.score = result.score;
      }

      newBoard[move.index] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === "O") {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const handleClick = (i) => {
    if (isDisabled) return;

    const newBoard = [...board];
    if (winner || newBoard[i]) return;

    newBoard[i] = "X";
    setBoard(newBoard);
    setIsXNext(false);
    playXSound();
    setIsDisabled(true);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        setXWins(xWins + 1);
        playWinSound();
      } else {
        setOWins(oWins + 1);
        playLoseSound();
      }
      setIsDisabled(false);
      return;
    }

    if (!newBoard.includes(null)) {
      setTies(ties + 1);
      playTieSound();
      setIsDisabled(false);
      return;
    }

    setMovesHistory((prevHistory) => [...prevHistory, newBoard]);

    setTimeout(() => {
      handleAIMove(newBoard);
    }, 2000);
  };

  const handleAIMove = (currentBoard) => {
    const newBoard = [...currentBoard];
    const bestMove = minimax(newBoard, "O").index;
    newBoard[bestMove] = "O";
    setBoard(newBoard);
    setIsXNext(true);
    playOSound();
  
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        setXWins(xWins + 1);
        playWinSound();
      } else {
        setOWins(oWins + 1);
        playLoseSound();
      }
    } else if (!newBoard.includes(null)) {
      setTies(ties + 1);
      playTieSound();
    }
  
    setIsDisabled(false);
    setMovesHistory((prevHistory) => [...prevHistory, newBoard]);

    if (selectedQuestionIndex + 1 === 4) {
      handleEndGame();
    } else {
    setShowModal(true);       
    }
  };
  

  const handleRestart = () => {
    window.location.href = window.location.href;
    // setBoard(initialBoardState);
    // setIsXNext(true);
    // setWinner(null);
    // setMovesHistory([]);
    // setIsDisabled(false);
  };

  const handleUndo = () => {
    if (movesHistory.length > 0) {
      const lastMove = movesHistory[movesHistory.length - 2] || initialBoardState;
      setBoard(lastMove);
      setIsXNext((prev) => !prev);
      setMovesHistory((prevHistory) => prevHistory.slice(0, -1));
      setIsDisabled(false);
    }
  };


  const calculateResult = async () => {
    const correctAnswers = [];
    const wrongAnswers = [];

    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctOption) {
        correctAnswers.push(question);
      } else {
        wrongAnswers.push(question);
      }
    });

    let verdict = "Pass";
    if (correctAnswers.length === 0) {
      verdict = "Fail";
    }
    if (correctAnswers.length === questions.length && correctAnswers.length !== 0) {
      verdict = "Won";
    }

    const resultData = {
      correct: correctAnswers,
      wrong: wrongAnswers,
      time: internalTimer,
      verdict: verdict,
    };
    setResult(resultData);
  };


  const handleAnswerSelection = (option) => {
    const isCorrect = questions[selectedQuestionIndex].correctOption.toString() === option;
    setSelectedOptions({
      ...selectedOptions,
      [selectedQuestionIndex]: option,
    });
    setAttemptedQuestions(Object.keys(selectedOptions).length + 1);
    setShowModal(false);
    setInternalTimer((prevTimer) => prevTimer - 1);
    if (selectedQuestionIndex + 1 < questions.length) {
      setSelectedQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleEndGame();
    }
    if(!isCorrect){
      setLifeLine(prevLifeLine => {
        const updatedLifeLine = prevLifeLine - 1;
        if(updatedLifeLine == 0){
          handleEndGame();
        }
        return updatedLifeLine; // Return the updated value to update the state
      });
    }
    // if(lifeLine==0){
    //   console.log('Hi');
    //   calculateResult();
    // }
  };
  
  const handleSkip = () => {
    setShowModal(false);
    if(lifeLine == 1){
      handleEndGame();
    }
    if (selectedQuestionIndex + 1 < questions.length) {
      setSelectedQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      calculateResult();
    }
    setLifeLine(prevLifeLine => prevLifeLine-1);
    setInternalTimer((prevTimer) => prevTimer - 1);
  };


  const renderSquare = (i) => {
    return (
      <button key={i} className={styles.square} onClick={() => handleClick(i)}>
        {board[i] === "X" && <img src={xImage} className={styles.symbol} alt="X" />}
        {board[i] === "O" && <img src={oImage} className={styles.symbol} alt="O" />}
      </button>
    );
  };

  const defaultLostOptions = {
    loop: true,
    autoplay: true,
    animationData: lost,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const defaultWinOptions = {
    loop: true,
    autoplay: true,
    animationData: win,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  
  const renderModalContent = () => {
    if (viewSet === "result") {
      const totalMarks = result.correct.length * 5;
      const gameScore = xWins + 0;
      return (
        <div style={{display:"flex", justifyContent:"center", margin:"3vh 1vw"}}>
        <div>
          <div>
            <h4>Total Questions: {questions.length-1}</h4>
            <h4>Correct Attempted: {result.correct.length}</h4>
            <h4>Total Game Score: {gameScore}</h4>
            <div style={{display:"flex", gap:"2vw", justifyContent:'center'}}>
              {/* <button className={styles.gameButton} onClick={resetGame}>Retake Exam</button> */}
              <button className={styles.gameButton} onClick={() => {window.location.href = "./#/home"}}>End Game</button>
              {/* <button className={styles.gameButton} onClick={() => setViewSet("review")}>Review Answers</button> */}
            </div>
          </div>
        </div>
        <div>
          {result.verdict === "Won" && (
            <Lottie options={defaultWinOptions}
            height={300}
            width={300}
            />
          )}
          {result.verdict === "Fail" && (
          <Lottie options={defaultLostOptions}
          height={300}
          width={300}
          />
          
          )}
        </div>
      </div>
      );
    }

    return (
      <div>
        {questions.length > 0 && (
          <>
           <div style={{ display: "grid", textAlign: "start" }}>
              <div style={{display:"flex", justifyContent:"space-between",height:"min-content"}}>
              <h4 style={{ margin: "0vh 3vw" }}>{selectedQuestionIndex + 1}: {questions[selectedQuestionIndex]?.name}</h4>
              {/* <h4 style={{ backgroundColor:"#FFC340", borderRadius:"50%", width:"2.5vw", height:"2.5vw", textAlign:"center", padding:"0.5vh", marginRight:"2vw"}}>{internalTimer}</h4> */}
              </div>
              <br />
              <div style={{ display: "grid", gap: "2vh" }}>
                 {Object.entries(questions[selectedQuestionIndex]?.options).sort().map(([key, value]) => (
              <div style={{ border: "3px solid #ac7474", borderRadius: "40px", margin: "0vh 2vw" }} key={key} onClick={() => handleAnswerSelection(key)}>
                 <h4 style={{ margin: "2vh 2vw" }}>{key}: {value}</h4>
              </div>
            ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button style={{ placeSelf: "end", margin: "1vh 2vw 0vh 2vw" }} className={styles.gameButton} onClick={handleSkip}>Skip</button>

              <button style={{ placeSelf:"end", margin: "1vh 2vw 0vh 2vw" }} className={styles.gameButton} onClick={handleEndGame}>End Game</button>
            </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  const handleEndGame = () => {
    calculateResult();
    setShowModal(true);
    setViewSet("result");
    // setTimeout(() => {
    //   setShowModal(false);
    //   window.location.href = "/home";
    // }, 15000);
  };
  return (
    <>
     <div className={styles.mainDiv}>
      <LoginHeader />
      <div className={styles.innerGrid}>
        <div>
        <div style={{ display: 'flex', justifyContent: "space-between" }}>
  <button className={styles.gameButton} onClick={handleEndGame}>End Game</button>
  <h3 style={{ marginLeft: '10px' }}>
    LifeLines : 
    {lifeLine === 0
      ? 0
      : Array.from({ length: lifeLine }, (_, index) => (
          <span key={index} className="heart-symbol">❤️</span>
        ))}
  </h3>
  <h3></h3>
</div>
          <div className={styles.board}>
          {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
          </div>
          <div style={{ display: "flex", gap: "10vw", alignItems: "center", justifyContent: "center", marginTop: "3vh" }}>
            <div className={styles.status}>
              <div style={{ display: "flex", gap: "4vw" }}>
                <div>Player(X)  <div>{xWins}</div></div>
                <div>Ties <div>{ties}</div></div>
                <div>Computer(O)  <div>{oWins}</div></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <button className={styles.gameButton} onClick={handleRestart}>
                Restart
              </button>
              <button className={styles.gameButton} onClick={handleUndo}>
                Undo
              </button>
            </div>
          </div>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} header={viewSet === "result" ? "Result" : viewSet === "review" ? "Review" : "Question"} size="xlarge">
          {renderModalContent()}
        </Modal>
        </div>
      </div>
    </div>
    </>
  );
};

export default TicTacToe;

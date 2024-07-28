import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import Modal from "./Modal/modal";
import styles from "../components/games/games.module.css";
import Lottie from 'react-lottie';
import lost from "./games/lost.json";
import win from "./games/win.json";

function WriteExam({ onObtainedMarks, onModalVisibilityChange, gameScore, updateLifeLine, perQue }) {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [viewSet, setViewSet] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [questionTimerId, setQuestionTimerId] = useState(null);
  const [internalTimer, setInternalTimer] = useState(5);

  const [user, setUser] = useState();
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const [lifeLine, setLifeLine] = useState(2);

  const handleLifeLineChange = (newLifeLine) => {
    updateLifeLine(newLifeLine);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const game = window.location.href.split('/').pop();

  useEffect(() => {
    const getExamData = async () => {
      try {
        const quizRef = doc(db, "Quizzes", game);
        const quizSnapshot = await getDoc(quizRef);

        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.data();
          setExamData(quizData);
          console.log(quizData);

          const questionIds = quizData.question;
          const questionPromises = questionIds.map(async (questionId) => {
            const questionRef = doc(db, "Questions", questionId);
            const questionSnapshot = await getDoc(questionRef);
            return { ...questionSnapshot.data(), id: questionSnapshot.id };
          });

          const fetchedQuestions = await Promise.all(questionPromises);
          console.log(fetchedQuestions);
          setQuestions(fetchedQuestions);
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    getExamData();
  }, []);

  const calculateResult = async () => {
    let correctAnswers = [];
    let wrongAnswers = [];

    questions.forEach((question, index) => {
      if (question.correctOption.toString() === selectedOptions[index]) {
        correctAnswers.push(question);
      } else {
        wrongAnswers.push(question);
      }
    });

    const perQueMarks = 1;
    const obtainedMarks = correctAnswers.length * perQueMarks;
    const obtainedPercent = (obtainedMarks / questions.length) * 100;

    let verdict = "Pass";
    if (obtainedMarks <= 0) {
      verdict = "Fail";
    }
    if (obtainedMarks === questions.length && obtainedMarks !== 0) {
      verdict = "Won";
    }

    const tempResult = {
      correctAnswers,
      wrongAnswers,
      obtainedMarks,
      obtainedPercent,
      verdict,
      attemptedQuestions,
    };

    if (onObtainedMarks) {
      onObtainedMarks(obtainedMarks);
    }

    if (user) {
      const correctAnswerIds = correctAnswers.map((q) => q.id);
      const wrongAnswerIds = wrongAnswers.map((q) => q.id);

      const gameScoreRef = doc(db, "GameReports", user.uid);
      const gameScoreSnapshot = await getDoc(gameScoreRef);

      let scoresToUpdate = {};

      if (gameScoreSnapshot.exists()) {
        scoresToUpdate = gameScoreSnapshot.data().scores || {};
      } else {
        // Initialize scores for all games to 0 if the document doesn't exist
        const allGames = ["2048-game", "bricks-mania", "slidding-puzzle", "tic-tac-toe"];
        allGames.forEach((game) => {
          scoresToUpdate[game] = 0;
        });
      }

      // Update the score only if it's greater than the existing score
      if (gameScore > scoresToUpdate[game]) {
        scoresToUpdate[game] = gameScore;
      }

      try {
        await setDoc(gameScoreRef, {
          user: user.uid,
          scores: {
            ...scoresToUpdate,
          },
        }, { merge: true });

        console.log("Report saved successfully");
      } catch (error) {
        console.error("Error saving report: ", error);
      }
    } else {
      console.error("No user signed in or quiz ID missing");
    }

    setResult(tempResult);
    setViewSet("result");
    setShowModal(true);
  };

  useEffect(() => {
    if (viewSet !== "result" && viewSet !== "review") {
      const initialDelay = setTimeout(() => {
        setShowModal(true);
        if (onModalVisibilityChange) {
          onModalVisibilityChange(true);
        }
        setSelectedQuestionIndex(0);

        const timerId = setInterval(() => {
          setSelectedQuestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < questions.length) {
              setShowModal(true);
              if (onModalVisibilityChange) {
                onModalVisibilityChange(true);
              }
              return nextIndex;
            } else {
              clearInterval(timerId);
              return prevIndex;
            }
          });
        }, 15000);

        setQuestionTimerId(timerId);
      }, 10000);

      return () => {
        clearTimeout(initialDelay);
        clearInterval(questionTimerId);
      };
    }
  }, [viewSet, questions.length]);

  useEffect(() => {
    if (showModal && internalTimer > 0 && viewSet !== "result" && viewSet !== "result") {
      const timer = setTimeout(() => {
        setInternalTimer((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (internalTimer === 0) {
      setShowModal(false);
      if (onModalVisibilityChange) {
        onModalVisibilityChange(false);
      }
      setInternalTimer(5);
    }
  }, [showModal, internalTimer]);

  const handleAnswerSelection = (option) => {
    const isCorrect = questions[selectedQuestionIndex].correctOption.toString() === option;
    setSelectedOptions({
      ...selectedOptions,
      [selectedQuestionIndex]: option,
    });

    if (!isCorrect) {
      setIncorrectAnswers((prev) => prev + 1);
    }

    setAttemptedQuestions(Object.keys(selectedOptions).length + 1);
    setShowModal(false);
    if (onModalVisibilityChange) {
      onModalVisibilityChange(false);
    }
    setInternalTimer(5);

    if (!isCorrect && incorrectAnswers + 1 >= 2) {
      handleEndGame();
    }
    if(!isCorrect){
      setLifeLine(prevLifeLine => {
        const updatedLifeLine = prevLifeLine - 1;
        handleLifeLineChange(updatedLifeLine); // Pass the updated value directly
        return updatedLifeLine; // Return the updated value to update the state
      });
    }
    if(lifeLine==0){
      handleEndGame();
    }
  };

  const handleEndGame = () => {
    if (onModalVisibilityChange) {
      onModalVisibilityChange(true);
    }
    clearInterval(questionTimerId);
    calculateResult();
    setViewSet("result");
    setTimeout(() => {
      setShowModal(false);
      window.location.href = "/#/home";
    }, 15000);
  };

  const handleSkip = () => {
    setShowModal(false);
    if(lifeLine == 1){
      handleEndGame();
    }
    setLifeLine(prevLifeLine => prevLifeLine-1);
    handleLifeLineChange(lifeLine-1);
    setInternalTimer(5);
  };

  const resetGame = () => {
    window.location.href = window.location.href;
  };

  const totalMarks = attemptedQuestions * perQue;

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

  return (
    <div>
      <button className={styles.gameButton} style={{ display: "flex" }} onClick={handleEndGame}>End Game</button>
      <Modal isOpen={showModal} onClose={() => { if (viewSet === "result") { window.location.href = "./#/home"; } setShowModal(false); if (onModalVisibilityChange) { onModalVisibilityChange(false); } }} header={viewSet === "result" ? "Result" : viewSet === "review" ? "Review" : "Question"} size="xlarge">
        {viewSet === "result" ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "3vh 1vw" }}>
            <div>
              <div>
                <h4>Total Questions: {questions.length}</h4>
                <h4>Attempted Questions: {attemptedQuestions}</h4>
                <h4>Correct Answers: {result.obtainedMarks}</h4>
                <h4>Game Score: {gameScore}</h4>
                <div style={{ display: "flex", gap: "2vw", justifyContent: 'center' }}>
                  <button className={styles.gameButton} onClick={resetGame}>Retake Exam</button>
                  <button className={styles.gameButton} onClick={() => { window.location.href = "./#/home"; }}>End Game</button>
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
        ) :
          // viewSet === "review" ? (
          //   <div>
          //     <div style={{ display: "grid", gap: "2vh", maxHeight: "50vh", overflow: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
          //       {questions.map((question, index) => {
          //         const isCorrect = question.correctOption.toString() === selectedOptions[index];
          //         return (
          //           <div key={index}>
          //             <h1>{index + 1}: {question.name}</h1>
          //             <h1>Submitted Answer: {selectedOptions[index]}</h1>
          //             <h1>Correct Answer: {question.correctOption}</h1>
          //           </div>
          //         );
          //       })}
          //     </div>
          //     <div style={{ display: "flex", placeContent: "center", gap: "2vw" }}>
          //       <button className={styles.gameButton} onClick={resetGame}>Retake Exam</button>
          //       <button className={styles.gameButton} onClick={() => { setShowModal(false); if (onModalVisibilityChange){onModalVisibilityChange(false);} }}>Resume Game</button>
          //     </div>
          //   </div>
          // ) : 
          (
            questions[selectedQuestionIndex] && (
              <div style={{ display: "grid", textAlign: "start" }}>
                <div style={{ display: "flex", justifyContent: "space-between", height: "min-content" }}>
                  <h4 style={{ margin: "0vh 3vw" }}>{selectedQuestionIndex + 1}: {questions[selectedQuestionIndex]?.name}</h4>
                  <h4 style={{ backgroundColor: "#FFC340", borderRadius: "50%", width: "2.5vw", height: "2.5vw", textAlign: "center", padding: "0.5vh", marginRight: "2vw" }}>{internalTimer}</h4>
                </div>
                <br />
                <div style={{ display: "grid", gap: "2vh" }}>
                  {Object.keys(questions[selectedQuestionIndex]?.options).sort().map((option) => (
                    <div
                      style={{
                        border: "3px solid #ac7474",
                        borderRadius: "40px",
                        margin: "0vh 2vw",
                        backgroundColor: selectedOptions[selectedQuestionIndex] === option ? "#BE60D0" : "transparent"
                      }}
                      key={option}
                      onClick={() => handleAnswerSelection(option)}
                    >
                      <h4 style={{ margin: "2vh 2vw" }}>{option}: {questions[selectedQuestionIndex]?.options[option]}</h4>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button style={{ placeSelf: "end", margin: "1vh 2vw 0vh 2vw" }} className={styles.gameButton} onClick={handleSkip}>Skip</button>

                <button style={{ placeSelf: "end", margin: "1vh 2vw 0vh 2vw" }} className={styles.gameButton} onClick={handleEndGame}>End Game</button>
                </div>
              </div>
            )
          )}
      </Modal>
    </div>
  );
}

export default WriteExam;
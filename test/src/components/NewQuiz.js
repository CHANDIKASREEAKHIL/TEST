import React, { useState, useEffect } from "react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "./firebase";
import Modal from "./Modal/modal";
import styles from "../components/games/games.module.css";
import Lottie from 'react-lottie';
import lost from "./games/lost.json";
import win from "./games/win.json";

function WriteExam({ onObtainedMarks, gameScore, perQue, onNextQuestion, onModalVisibilityChange }) {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState({});
  const [viewSet, setViewSet] = useState("");
  const [internalTimer, setInternalTimer] = useState(5); // Initialize internalTimer state
  const [user, setUser] = useState();
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const fetchExamData = async () => {
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

    fetchExamData();
  }, []);

  const handleEndGame = () => {
    calculateResult();
    setViewSet("result");
    setTimeout(() => {
      onModalVisibilityChange(false); // Use onModalVisibilityChange to control modal visibility
      window.location.href = "/#/home";
    }, 15000);
  };

  const handleAnswerSelection = (option) => {
    setSelectedOption(option);
    setAttemptedQuestions(attemptedQuestions + 1);
    setInternalTimer(5); // Reset timer for next question
    if (onModalVisibilityChange) {
      onModalVisibilityChange(false); // Close the modal
    }
    if (onNextQuestion && selectedQuestionIndex + 1 < questions.length) {
      onNextQuestion(selectedQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];
      let obtainedMarks = 0;

      questions.forEach((question, index) => {
        const correctOption = question.correctOption;
        const selected = selectedOption === correctOption;

        if (selected) {
          correctAnswers.push(question);
          obtainedMarks += perQue;
        } else {
          wrongAnswers.push(question);
        }
      });

      const obtainedPercent = (obtainedMarks / (questions.length * perQue)) * 100;
      const verdict = obtainedMarks > 0 ? "Won" : "Fail";

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        obtainedMarks,
        obtainedPercent,
        verdict,
        attemptedQuestions,
      };

      setResult(tempResult);
      setViewSet("result");
      if (onModalVisibilityChange) {
        onModalVisibilityChange(true); // Open the modal
      }

      if (onObtainedMarks) {
        onObtainedMarks(obtainedMarks);
      }

      if (user) {
        const correctAnswerIds = correctAnswers.map((q) => q.id);
        const wrongAnswerIds = wrongAnswers.map((q) => q.id);

        const reportData = {
          quiz: "tic-tac-toe",
          result: {
            ...tempResult,
            correctAnswers: correctAnswerIds,
            wrongAnswers: wrongAnswerIds,
          },
          user: user.uid,
          createdAt: new Date(),
        };

        await addDoc(collection(db, "Reports"), reportData);
        console.log("Report saved successfully");
      } else {
        console.error("No user signed in or quiz ID missing");
      }
    } catch (error) {
      console.error("Error calculating result:", error);
    }
  };

  useEffect(() => {
    if (onModalVisibilityChange && internalTimer > 0 && viewSet !== "result" && viewSet !== "review") {
      const timer = setTimeout(() => {
        setInternalTimer((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (internalTimer === 0) {
      if (onModalVisibilityChange) {
        onModalVisibilityChange(false); // Close the modal
      }
      setInternalTimer(5); // Reset timer for next question
      if (onNextQuestion && selectedQuestionIndex + 1 < questions.length) {
        onNextQuestion(selectedQuestionIndex + 1);
      } else {
        calculateResult();
      }
    }
  }, [onModalVisibilityChange, internalTimer, selectedQuestionIndex, onNextQuestion, questions.length, viewSet]);

  const resetGame = () => {
    window.location.reload();
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
      <Modal isOpen={onModalVisibilityChange} onClose={() => { if (onModalVisibilityChange) onModalVisibilityChange(false); }} header={viewSet === "result" ? "Result" : viewSet === "review" ? "Review" : "Question"} size="xlarge">
        {viewSet === "result" ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "3vh 1vw" }}>
            <div>
              <div>
                <h4>Total Questions: {questions.length}</h4>
                <h4>Attempted Questions: {attemptedQuestions}</h4>
                <h4>Marks Obtained: {result.obtainedMarks} x {perQue} = {totalMarks}</h4>
                <h4>Total Game Score: {gameScore}</h4>
                <div style={{ display: "flex", gap: "2vw", justifyContent: 'center' }}>
                  <button className={styles.gameButton} onClick={resetGame}>Retake Exam</button>
                  <button className={styles.gameButton} onClick={() => { window.location.href = "./#/home" }}>End Game</button>
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
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh", maxHeight: "50vh", overflow: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {questions.length > 0 && questions[selectedQuestionIndex] && (
              <div>
                <h1>{selectedQuestionIndex + 1}: {questions[selectedQuestionIndex].name}</h1>
                <div style={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
                  {Object.entries(questions[selectedQuestionIndex].options).map(([key, value], index) => (
                    <button
                      key={index}
                      className={styles.optionButton}
                      onClick={() => handleAnswerSelection(key)}
                      style={{
                        padding: "1vh 2vw",
                        background: selectedOption === key ? "#cce7ff" : "white",
                        border: selectedOption === key ? "2px solid #4da6ff" : "1px solid #ccc",
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2>{internalTimer} seconds left!</h2>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default WriteExam;
